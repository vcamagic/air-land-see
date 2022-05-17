using ALS.Models.Models;

namespace ALS.Services.Interfaces
{
    public interface IGameClient
    {
        Task GameSetup(bool isHost, string opponentName);
        Task GameFound(Guid id);
        Task OpponentTurn(Board board, int targetId, bool overwriteTurn, bool isForfeit);
        Task GameEnded();
        Task EnemyConcede();
        Task EnemyQuit();
        Task RematchRefused();
        Task ReceivePreparedGame(Board board);
    }
}