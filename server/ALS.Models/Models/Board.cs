namespace ALS.Models.Models;

public class Board
{
    public List<Lane> Lanes { get; set; }
    public Player Player { get; set; }
    public Player Opponent { get; set; }
    public bool PlayerTurn { get; set; }
    public List<Card> Deck { get; set; }
    public bool Targeting { get; set; }
}
