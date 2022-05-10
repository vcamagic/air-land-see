namespace ALS.Models.Models;

public class Player
{
    public string ConnectionId { get; set; }
    public string Color { get; set; }   
    public List<Card> Hand { get; set; }
    public int Score { get; set; }
    public string Name { get; set; }
    public bool Aerodrome { get; set; }
    public bool Airdrop { get; set; }
}
