using ALS.Services.Hub;
using ALS.Services.Interfaces;
using ALS.Services.Repository;
using ALS.Services.Worker;

var AllowSpecificOrigins = "AllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration
                                .GetSection("AllowedOrigins")
                                .GetChildren().Select(x => x.Value)
                                .ToArray();
                                
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, build =>
    {
        build.AllowAnyHeader().AllowCredentials().AllowAnyHeader().WithOrigins(allowedOrigins);
    });

});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHostedService<WorkerService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<GameRepository>();

var app = builder.Build();
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
