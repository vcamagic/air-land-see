using ALS.Models.Models;
using ALS.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ServerApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BoardController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    [HttpPost]
    public IActionResult Update(Board board)
    {
        try
        {
            _boardService.UpdateBoard(board);
            return Ok("Nice update.");
        }
        catch (Exception exp)
        {
            return BadRequest(exp.Message);
        }
    }
}
