using ALS.Models.Models;

namespace ALS.Services.Data;

public class BoardData
{
    public static Board Board = new Board
    {
        Lanes = new List<Lane>(),
        Deck = new List<Card>(),
        Player = new Player(),
        Opponent = new Player(),
        PlayerTurn = true
    };
}
