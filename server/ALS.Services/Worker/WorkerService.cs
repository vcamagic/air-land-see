using ALS.Services.Interfaces;
using ALS.Services.Repository;
using Microsoft.Extensions.Hosting;

namespace ALS.Services.Worker;

public class WorkerService : BackgroundService
{
    private const int generalDelay = 60 * 60 * 1000;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(generalDelay, stoppingToken);
            RemoveInactiveGames();
        }

    }

    private void RemoveInactiveGames()
    {
        GameRepository.Games.RemoveAll(game => DateTime.Compare(game.LastActive, DateTime.Now.AddHours(-3)) < 0);
    }

}
