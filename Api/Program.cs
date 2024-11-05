using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.Data;
using WebApi.Extensions;
using WebApi.Interfaces;
using WebApi.Middleware;
using WebApi.Services;

namespace WebApi;

public class Program
{
    public static void Main(string[] args)
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

        app.Run();
    }
}