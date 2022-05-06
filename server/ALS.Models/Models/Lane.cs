namespace ALS.Models.Models;

public class Lane
{
    public LaneType Type { get; set; }
    public List<Card> PlayerCards { get; set; }
    public List<Card> OpponentCards { get; set; }
    public bool Highlight { get; set; }

    public int PlayerScore { get; set; }
    public int OpponentScore { get; set; }

}
