using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Interfaces;
using WebApi.Services;

namespace WebApi.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        // Add services to the container.
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        return services;
    }
}