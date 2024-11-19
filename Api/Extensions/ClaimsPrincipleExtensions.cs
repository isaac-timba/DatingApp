using System.Security.Claims;

namespace WebApi.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.GivenName);

        if (username == null) throw new Exception("Cannot get username from token");
        
        return username;
    }
}