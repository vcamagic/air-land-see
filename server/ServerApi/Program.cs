using ALS.Services.Hub;
using ALS.Services.Interfaces;
using ALS.Services.Services;
using ServerApi.Extensions;

var AllowSpecificOrigins = "AllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, builder =>
    {
        builder.AllowAnyHeader().AllowAnyHeader().WithOrigins("http://localhost:3000");
    });
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(typeof(WebSocketHub), new WebSocketHub());
builder.Services.AddScoped<IBoardService, BoardService>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120)
});

WebSocketHub _webSocketHub = app.Services.GetRequiredService<WebSocketHub>();

app.ConfigureWebSockets(_webSocketHub);

app.UseCors(AllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
