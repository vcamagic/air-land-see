using System.Net.WebSockets;
using ALS.Services.Hub;

namespace ServerApi.Extensions;

public static class WebSocketsExtensions
{
    public static void ConfigureWebSockets(this IApplicationBuilder app, WebSocketHub webSocketHub)
    {
        app.Use(async (context, next) =>
        {
            try
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    using WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    webSocketHub.AddSocket(webSocket);

                    while (webSocket.State == WebSocketState.Open)
                    {
                        await Task.Delay(TimeSpan.FromMinutes(1));
                    }

                    webSocketHub.RemoveSocket(webSocket);

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
    }
}
