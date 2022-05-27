using ALS.Models.Models;

namespace ALS.Services.Interfaces;

public interface IChatClient
{
    Task ReceiveMessage(string message);
}
