using ALS.Models.Models;

namespace ALS.Services.Interfaces
{
    public interface IGameRepository
    {
        public List<Game> Games { get; set; }
    }
}