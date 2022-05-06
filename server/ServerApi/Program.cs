using System.Net.WebSockets;
using ALS.Services.Hub;
using ALS.Services.Interfaces;
using ALS.Services.Services;

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

app.UseCors(AllowSpecificOrigins);

app.UseAuthorization();

app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120)
});

app.MapControllers();

WebSocketHub _webSocketHub = app.Services.GetRequiredService<WebSocketHub>();

app.Use(async (context, next) =>
{
    try
    {
        // You can check header and request in here. For example
        // if(context.Response.Headers...)
        // if(context.Request.Query...)

        // We just check IsWebSocketRequest
        if (context.WebSockets.IsWebSocketRequest)
        {
            // We accept the socket connection
            WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();

            // we use underscore to discard return here because we do not have to waite return
            _webSocketHub.AddSocket(webSocket);

            // We have to hold the context here if we release it, server will close it
            while (webSocket.State == WebSocketState.Open)
            {
                await Task.Delay(TimeSpan.FromMinutes(1));
            }

            // if socket status is not open ,remove it
            _webSocketHub.RemoveSocket(webSocket);

            // check socket state if it is not closed, close it
            if (webSocket.State != WebSocketState.Closed && webSocket.State != WebSocketState.Aborted)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection End", CancellationToken.None);
            }
        }
        else
        {
            await next();
        }
    }
    catch (Exception exp)
    {
        System.Console.WriteLine(exp);//log ws connection error
    }
});

app.Run();
