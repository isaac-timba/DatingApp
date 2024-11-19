using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Interfaces;

namespace WebApi.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var usersDto = await userRepository.GetMembersAsync();

        return Ok(usersDto);
    }

    [HttpGet("{username}")] // /api/users/1
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var userDto = await userRepository.GetMemberByUsernameAsync(username);

        if (userDto == null)
        {
            return NotFound();
        }


        return Ok(userDto);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return BadRequest("Could not find user");

        mapper.Map(memberUpdateDto, user);

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return BadRequest("Could not find user");

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo()
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        user.Photos.Add(photo);

        if (await userRepository.SaveAllAsync())
            return CreatedAtAction(nameof(GetUser), new { username = user.Username }, mapper.Map<PhotoDto>(photo));

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return BadRequest("Could not find user");

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null || photo.IsMain) return BadRequest("Cannot use this as main photo");

        var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMainPhoto != null) currentMainPhoto.IsMain = false;
        photo.IsMain = true;

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to set main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");
        
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("This photo cannot be deleted");

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }
        
        user.Photos.Remove(photo);
        if (await userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to set main photo");
    }
}