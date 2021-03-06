using ALS.Models.Models;

namespace ALS.Services.Interfaces
{
    public interface IGameClient
    {
        Task GameSetup(bool isHost, string opponentName);
        Task GameFound(Guid id);
        Task OpponentTurn(Board serverBoard, int targetId, bool overwriteTurn);
        Task ReceiveNewRound(Board serverBoard);
        Task EnemyConcede(Board serverBoard);
        Task ReceivePreparedGame(Board board);
        Task ReceiveMessage(string message);
        Task GameEnded();
        Task EnemyQuit();
        Task RematchRefused();
    }
}