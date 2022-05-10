using System.Text.Json;
using ALS.Models.Models;
using ALS.Services.Data;
using ALS.Services.Hub;
using ALS.Services.Interfaces;

namespace ALS.Services.Services;

public class BoardService : IBoardService
{
    private readonly WebSocketHub _webSocketHub;

    public BoardService(WebSocketHub webSocketHub)
    {
        _webSocketHub = webSocketHub;
    }
    public void UpdateBoard(Board board)
    {
        try
        {
            BoardData.Board = board;

            _webSocketHub.SendAll(JsonSerializer.Serialize(BoardData.Board));
        }
        catch (Exception ex)
        {
            System.Console.WriteLine(ex);
        }
    }
}
