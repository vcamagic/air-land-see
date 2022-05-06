using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using ALS.Models.Models;
using ALS.Services.Data;

namespace ALS.Services.Hub;

public class WebSocketHub
{
    private List<WebSocket> _webSocketList = new List<WebSocket>();

    // add a socket to list
    public void AddSocket(WebSocket webSocket)
    {
        try
        {
            if (webSocket == null) return;
            // _webSocketList this list is used asynchronously so when we want to use it we need to use lock
            lock (_webSocketList) _webSocketList.Add(webSocket);

            // if socket open send initial message
            if (webSocket.State == WebSocketState.Open)
            {
                byte[] messageBuffer = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(BoardData.Board));
                _ = webSocket.SendAsync(new ArraySegment<byte>(messageBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
        catch (Exception exp)
        {
            System.Console.WriteLine(exp);//log 
        }
    }

    // remove a socket from list
    public void RemoveSocket(WebSocket webSocket)
    {
        lock (_webSocketList) _webSocketList.Remove(webSocket);
    }

    // send a message to all open sockets
    public async Task SendAll(string message)
    {
        try
        {
            List<WebSocket> webSocketList;
            lock (_webSocketList) webSocketList = _webSocketList;

            byte[] byteMessage = Encoding.UTF8.GetBytes(message);

            webSocketList.ForEach(async f =>
            {
                if (f.State == WebSocketState.Open)
                {
                    await f.SendAsync(new ArraySegment<byte>(byteMessage), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            });
        }
        catch (Exception)
        {
            // log exp
        }
    }
}
