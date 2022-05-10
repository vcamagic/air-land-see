namespace ALS.Services.Interfaces
{
    public interface IGameClient
    {
        Task GameSetup(string playerColor, string opponentName);
        Task GameFound(Guid id);
        Task EnemyConcede();
        Task EnemyQuit();
        Task RematchRefused();
    }
}