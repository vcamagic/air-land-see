using ALS.Services.Interfaces;
using ALS.Models.Models;

namespace ALS.Services.Repository
{
    public class GameRepository
    {
        public static List<Game> Games { get; set; } = new List<Game>();
        public GameRepository()
        {
          
        }
    }
}