using ALS.Services.Interfaces;
using ALS.Models.Models;

namespace ALS.Services.Repository
{
    public class GameRepository:IGameRepository
    {
        public List<Game> Games { get; set; }

        public GameRepository()
        {
            Games = new List<Game>();
        }
    }
}