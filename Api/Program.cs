using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Extensions;
using WebApi.Middleware;

namespace WebApi;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddApplicationServices(builder.Configuration);
        builder.Services.AddIdentityService(builder.Configuration);

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Configure the HTTP request pipeline
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseCors(x => x
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:4200", "https://localhost:4200")
        );

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        using var serviceScope = app.Services.CreateScope();
        var services = serviceScope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<DataContext>();
            await context.Database.MigrateAsync();
            await Seed.SeedUsers(context);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occured while migrating the database.");
        }

        await app.RunAsync();
    }
}