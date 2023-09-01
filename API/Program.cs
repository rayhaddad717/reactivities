using Persistence;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using Microsoft.AspNetCore.Identity;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.Middleware;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    //so that all controllers require authentication
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
var app = builder.Build();

//our exception handler middleware
app.UseMiddleware<ExceptionMiddleware>();
//security
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny()); //cannot use app insdie iframe
app.UseCsp(opt => opt
.BlockAllMixedContent()
.StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "sha256-VdJLYZrBOhBJj2L4/+iZupDWpR1sppzSbgJzXdO/Oss=")) //css coming from our domain are good
.FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
.FormActions(s => s.Self())
.FrameAncestors(s => s.Self())
.ImageSources(s => s.Self().CustomSources("blob:", "data:", "https://res.cloudinary.com", "https://platform-lookaside.fbsbx.com"))
.ScriptSources(s => s.Self().CustomSources("https://connect.facebook.net"))
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000"); //one year
        await next.Invoke();
    });
}

//we didn't use https in our application
// app.UseHttpsRedirection();

//these are the middlewares
app.UseCors("CorsPolicy");
app.UseAuthentication(); //authentication must come before authorization
app.UseAuthorization();

app.UseDefaultFiles(); //serves index.html
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChatHub>("/chat"); // /chat is the route for signalR
app.MapFallbackToController("Index", "Fallback");

//using the using keyword means that when we are done with this scope everything inside it
//will be disposed and cleared from memory
//garbage collect does this but we don't know when
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error has occured during migration");
}
app.Run();
