namespace ALS.Models.Models;

public class Card
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Power { get; set; }
    public LaneType Type { get; set; }
    public bool FaceUp { get; set; }
    public bool Highlight { get; set; }
    public string Description { get; set; }
    public string Img { get; set; }
    public CardEffect Effect { get; set; }
}
