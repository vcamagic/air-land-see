using System.Net.WebSockets;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.Json;
using ALS.Models.Models;
using ALS.Services.Data;

namespace ALS.Services.Hub;

public class WebSocketHub
{
    private List<WebSocket> _webSocketList = new List<WebSocket>();

    public List<WebSocket> WebSocketList { get => _webSocketList; set => _webSocketList = value; }

    public void AddSocket(WebSocket webSocket)
    {
        try
        {
            if (webSocket == null) return;
            // _webSocketList this list is used asynchronously so when we want to use it we need to use lock
            lock (WebSocketList) WebSocketList.Add(webSocket);

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

    public void RemoveSocket(WebSocket webSocket)
    {
        lock (WebSocketList) WebSocketList.Remove(webSocket);
    }

    // send a message to all open sockets
    public void SendAll(string message)
    {
        try
        {
            List<WebSocket> webSocketList;
            lock (WebSocketList) webSocketList = WebSocketList;

            byte[] byteMessage = Encoding.UTF8.GetBytes(message);

            webSocketList.ForEach(async f =>
            {
                if (f.State == WebSocketState.Open)
                {
                    await f.SendAsync(new ArraySegment<byte>(byteMessage), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            });
        }
        catch (Exception exp)
        {
            System.Console.WriteLine(exp);
        }
    }
}
