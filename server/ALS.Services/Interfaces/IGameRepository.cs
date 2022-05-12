using ALS.Models.Models;

namespace ALS.Services.Interfaces
{
    public interface IGameRepository
    {
        public static List<Game> Games { get; set; }
    }
}