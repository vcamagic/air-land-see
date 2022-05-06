namespace ALS.Models.Models;

public class Player
{
    public List<Card> Hand { get; set; }
    public int Score { get; set; }
    public string Name { get; set; }
    public bool Aerodrome { get; set; }
    public bool Airdrop { get; set; }
}
