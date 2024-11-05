using System.Net;
using System.Text.Json;
using WebApi.Errors;

namespace WebApi.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment hostEnvironment)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await next(httpContext);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            
            var response = hostEnvironment.IsDevelopment() 
                ? new ApiException(httpContext.Response.StatusCode, e.Message, e.StackTrace)
                : new ApiException(httpContext.Response.StatusCode, e.Message, "Internal Server Error");
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            var json = JsonSerializer.Serialize(response, options);
            
            await httpContext.Response.WriteAsync(json);
        }
    }
}