using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Interfaces;

namespace WebApi.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users
            .Include(x => x.Photos)
            .ToListAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await context.Users
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(user => user.Id == userId);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(user  => user.Username == username);
    }

    public async Task<MemberDto?> GetMemberByUsernameAsync(string username)
    {
        return await context.Users
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(user => user.Username == username);
    }
}