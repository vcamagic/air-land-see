using ALS.Services.Repository;
using Microsoft.Extensions.Hosting;

namespace ALS.Services.Worker;

public class WorkerService : BackgroundService
{
    private const int generalDelay = 1 * 10 * 1000;
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(generalDelay, stoppingToken);
            RemoveInactiveGames();
        }
    }

    private static void RemoveInactiveGames()
    {
        GameRepository.Games.RemoveAll(game => DateTime.Compare(game.LastActive, DateTime.Now.AddHours(-1)) < 0);
    }

}
