using System.Text.Json;
using ALS.Models.Models;
using ALS.Services.Interfaces;
using ALS.Services.Repository;
using Microsoft.AspNetCore.SignalR;

namespace ALS.Services.Hub;

public class ChatHub : Hub<IChatClient>
{
    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public async Task SendMessageAsync(Guid id, Message message)
    {

        Game game = GameRepository.Games.FirstOrDefault(game => game.Id == id);

        if (game == null)
        {
            return;
        }

        if (Context.ConnectionId == game.PlayerOne.ConnectionId)
        {
            await Clients.Client(game.PlayerTwo.ConnectionId).ReceiveMessage(message.MessageContent);
        }
        else
        {
            await Clients.Client(game.PlayerOne.ConnectionId).ReceiveMessage(message.MessageContent);
        }

    }
}
