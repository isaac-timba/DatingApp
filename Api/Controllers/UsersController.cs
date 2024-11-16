using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTOs;
using WebApi.Interfaces;

namespace WebApi.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseApiController
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
        var username = User.FindFirst(ClaimTypes.GivenName)?.Value;

        if (username == null) return BadRequest("No username found in token");

        var user = await userRepository.GetUserByUsernameAsync(username);

        if (user == null) return BadRequest("Could not find user");

        mapper.Map(memberUpdateDto, user);

        if (await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user");
    }
}