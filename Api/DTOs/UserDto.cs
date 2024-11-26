using System.ComponentModel.DataAnnotations;

namespace WebApi.DTOs;

public class UserDto
{
    [Required] public required string Username { get; set; }
    [Required] public required string Token { get; set; }
    [Required] public required string KnownAs { get; set; }
    public string? PhotoUrl { get; set; }
}