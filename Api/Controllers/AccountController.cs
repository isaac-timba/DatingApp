using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Interfaces;
using WebApi.Services;

namespace WebApi.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] // /api/account/register
    public async Task<ActionResult<UserDto>> Register(Register registerDto)
    {

        if (await UserExists(registerDto.Username))
        {
            return BadRequest("Username is taken");
        }
        
        
        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            Username = registerDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };
        
        context.Add(user);
        await context.SaveChangesAsync();

        var token = tokenService.CreateToken(user);
        
        return new UserDto()
        {
            Username = user.Username,
            Token = token
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Username == loginDto.Username.ToLower());

        if (user == null)
        {
            return Unauthorized("Invalid username");
        }
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i])
            {
                return Unauthorized("Invalid password");
            }
        }
        
        var token = tokenService.CreateToken(user);
        
        return new UserDto
        {
            Username = user.Username,
            Token = token
        };
    }
    
    private async Task<bool> UserExists(string username)
    {
        return await context.Users.AnyAsync(x => x.Username.ToLower() == username.ToLower());
    }
    
}