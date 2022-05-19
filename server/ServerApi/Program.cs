using ALS.Services.Hub;
using ALS.Services.Interfaces;
using ALS.Services.Repository;
using ALS.Services.Worker;

var AllowSpecificOrigins = "AllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, builder =>
    {
        builder.AllowAnyHeader().AllowCredentials().AllowAnyHeader().WithOrigins("https://chama-leska.herokuapp.com", "http://localhost:3000");
    });
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHostedService<WorkerService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<IGameRepository, GameRepository>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<GameHub>("/game");

app.UseCors(AllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
