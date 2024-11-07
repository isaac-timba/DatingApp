using WebApi.DTOs;
using WebApi.Entities;

namespace WebApi.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<AppUser?> GetUserByIdAsync(int userId);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<MemberDto?> GetMemberByUsernameAsync(string username);
}