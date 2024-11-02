using System.ComponentModel.DataAnnotations;

namespace WebApi.DTOs;

public class Register
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string Password { get; set; }
}