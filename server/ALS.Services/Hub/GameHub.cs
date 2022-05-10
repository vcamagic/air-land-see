using Microsoft.AspNetCore.SignalR;
using ALS.Services.Interfaces;
using ALS.Models.Models;

namespace ALS.Services.Hub
{
    public class GameHub : Hub<IGameClient>
    {
        private IGameRepository Repo;

        public GameHub(IGameRepository repo)
        {
            Repo = repo;
        }


        public async void PrepareGame(Board board, Guid gameId)
        {
            var game = Repo.Games.FirstOrDefault(game => game.Id == gameId);
            if (game != null)
            {
                await Clients.Client(game.PlayerTwo.ConnectionId).ReceivePreparedGame(board);
            }
        }

        public async void Turn(Guid id, Board board)
        {
            Game g = Repo.Games.FirstOrDefault(x => x.Id == id);
            if (g != null)
            {
                if (Context.ConnectionId == g.CurrentPlayer.ConnectionId)
                {
                    if (g.CurrentPlayer == g.PlayerOne)
                    {
                        g.CurrentPlayer = g.PlayerTwo;
                    }
                    else
                    {
                        g.CurrentPlayer = g.PlayerOne;
                    }
                    await Clients.Client(g.CurrentPlayer.ConnectionId).OpponentTurn(board);
                }
            }
        }

        // public async void Undo(Guid id, AffectedField[] fields)
        // {
        //     Game g = Repo.Games.FirstOrDefault(x => x.Id == id);
        //     if (g != null)
        //     {
        //         string temp = g.CurrentPlayer.ConnectionId;
        //         if(Context.ConnectionId != g.CurrentPlayer.ConnectionId)
        //         {
        //             g.CurrentPlayer = g.CurrentPlayer == g.PlayerOne ? g.PlayerTwo : g.PlayerOne;
        //         }
        //         await Clients.Client(temp).EnemyUndo(fields);
        //     }
        // }

        public async void SubmitName(Guid id, string name)
        {
            Game g = Repo.Games.FirstOrDefault(x => x.Id == id);
            if (g != null)
            {
                if (g.PlayerOne.ConnectionId == Context.ConnectionId)
                {
                    g.PlayerOne.Name = name;
                }
                else
                {
                    g.PlayerTwo.Name = name;
                }
                if (!string.IsNullOrEmpty(g.PlayerOne.Name) && !string.IsNullOrEmpty(g.PlayerTwo.Name))
                {
                    await Clients.Client(g.PlayerOne.ConnectionId).GameSetup(true, g.PlayerTwo.Name);
                    await Clients.Client(g.PlayerTwo.ConnectionId).GameSetup(false, g.PlayerOne.Name);
                }
            }
        }

        public async void ReQueue(Guid id)//ako uradis rematch a drugi te ispali sa reque ili dc mora da ti nekako napise to i baci u obican q
        {
            Game game = Repo.Games.FirstOrDefault(x => x.Id == id);
            if (game != null)
            {
                if (game.PlayerOne.ConnectionId == Context.ConnectionId && game.RematchConfirmTwo)
                {
                    await Clients.Client(game.PlayerTwo.ConnectionId).RematchRefused();
                }
                if (game.PlayerTwo.ConnectionId == Context.ConnectionId && game.RematchConfirmOne)
                {
                    await Clients.Client(game.PlayerOne.ConnectionId).RematchRefused();
                }
                Repo.Games.Remove(game);
            }
            bool gameFound = false;
            foreach (Game g in Repo.Games)
            {
                if (g.PlayerOne != null && g.PlayerTwo == null)
                {
                    g.PlayerTwo = new Player() { Color = "black", ConnectionId = Context.ConnectionId };
                    g.CurrentPlayer = g.PlayerOne;
                    gameFound = true;
                    await Clients.Client(g.PlayerOne.ConnectionId).GameFound(g.Id);
                    await Clients.Client(g.PlayerTwo.ConnectionId).GameFound(g.Id);
                    break;
                }
            }
            if (!gameFound)
            {
                Repo.Games.Add(new Game() { PlayerOne = new Player() { Color = "white", ConnectionId = Context.ConnectionId } });
            }
        }

        public async void Rematch(Guid id)
        {
            Game g = Repo.Games.FirstOrDefault(x => x.Id == id);
            if (g != null)
            {
                if (g.PlayerOne.ConnectionId == Context.ConnectionId)
                {
                    g.RematchConfirmOne = true;
                }
                if (g.PlayerTwo.ConnectionId == Context.ConnectionId)
                {
                    g.RematchConfirmTwo = true;
                }
                if (g.RematchConfirmTwo && g.RematchConfirmOne)
                {
                    g.PlayerOne.Color = g.PlayerOne.Color == "white" ? "black" : "white";
                    g.PlayerTwo.Color = g.PlayerTwo.Color == "white" ? "black" : "white";
                    g.CurrentPlayer = g.PlayerOne.Color == "white" ? g.PlayerOne : g.PlayerTwo;
                    g.RematchConfirmOne = false;
                    g.RematchConfirmTwo = false;
                    await Clients.Client(g.PlayerOne.ConnectionId).GameFound(g.Id);
                    await Clients.Client(g.PlayerTwo.ConnectionId).GameFound(g.Id);
                }
            }
            else
            {
                await Clients.Client(Context.ConnectionId).RematchRefused();
            }
        }

        public async void Concede(Guid id)
        {
            Game g = Repo.Games.FirstOrDefault(x => x.Id == id);
            if (g != null)
            {
                if (g.PlayerOne != null && g.PlayerOne.ConnectionId != Context.ConnectionId)
                {
                    await Clients.Client(g.PlayerOne.ConnectionId).EnemyConcede();
                }
                if (g.PlayerTwo != null && g.PlayerTwo.ConnectionId != Context.ConnectionId)
                {
                    await Clients.Client(g.PlayerTwo.ConnectionId).EnemyConcede();
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            bool gameFound = false;
            foreach (Game g in Repo.Games)
            {
                if (g.PlayerOne != null && g.PlayerTwo == null)
                {
                    g.PlayerTwo = new Player() { Color = "black", ConnectionId = Context.ConnectionId };
                    g.CurrentPlayer = g.PlayerOne;
                    gameFound = true;
                    await Clients.Client(g.PlayerOne.ConnectionId).GameFound(g.Id);
                    await Clients.Client(g.PlayerTwo.ConnectionId).GameFound(g.Id);
                    break;
                }
            }
            if (!gameFound)
            {
                Repo.Games.Add(new Game() { PlayerOne = new Player() { Color = "white", ConnectionId = Context.ConnectionId } });
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            for (int i = 0; i < Repo.Games.Count; i++)
            {
                if (Repo.Games[i].PlayerOne != null && Repo.Games[i].PlayerOne.ConnectionId == Context.ConnectionId)
                {
                    if (Repo.Games[i].PlayerTwo != null)
                    {
                        if (Repo.Games[i].RematchConfirmTwo)
                        {
                            await Clients.Client(Repo.Games[i].PlayerTwo.ConnectionId).RematchRefused();
                        }
                        else
                        {
                            await Clients.Client(Repo.Games[i].PlayerTwo.ConnectionId).EnemyQuit();
                        }
                    }
                    Repo.Games.Remove(Repo.Games[i]);
                    break;

                }
                if (Repo.Games[i].PlayerTwo != null && Repo.Games[i].PlayerTwo.ConnectionId == Context.ConnectionId)
                {
                    if (Repo.Games[i].PlayerOne != null)
                    {
                        if (Repo.Games[i].RematchConfirmOne)
                        {
                            await Clients.Client(Repo.Games[i].PlayerOne.ConnectionId).RematchRefused();
                        }
                        else
                        {
                            await Clients.Client(Repo.Games[i].PlayerOne.ConnectionId).EnemyQuit();
                        }
                    }
                    Repo.Games.Remove(Repo.Games[i]);
                    break;
                }
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}