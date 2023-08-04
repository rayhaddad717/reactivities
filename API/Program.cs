using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Activities;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy",policy =>
    {
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
    }
    );
}
);
builder.Services.AddMediatR(typeof(List.Handler));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//we didn't use https in our application
// app.UseHttpsRedirection();

//these are the middlewares
app.UseCors("CorsPolicy");
app.UseAuthorization();

app.MapControllers();

//using the using keyword means that when we are done with this scope everything inside it
//will be disposed and cleared from memory
//garbage collect does this but we don't know when
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error has occured during migration");
}
app.Run();
