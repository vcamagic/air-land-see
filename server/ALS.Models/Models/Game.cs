namespace ALS.Models.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public Player PlayerOne { get; set; }
        public Player PlayerTwo { get; set; }
        // public Player CurrentPlayer { get; set; }
        public bool RematchConfirmOne { get; set; }
        public bool RematchConfirmTwo { get; set; }
        public DateTime LastActive { get; set; }

        public Game()
        {
            Id = Guid.NewGuid();
            PlayerOne = null;
            PlayerTwo = null;
            //CurrentPlayer = null;
            RematchConfirmOne = false;
            RematchConfirmTwo = false;
            LastActive = DateTime.Now;
        }
    }
}