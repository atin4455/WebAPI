// Controllers/TodoController.cs
using Microsoft.AspNetCore.Mvc;
using WebAPI.BackEnd.Models.DTOs;
using WebAPI.BackEnd.Services;

namespace WebAPI.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        // 只注入 Service
        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoDto>>> GetTodos()
        {
            var list = await _todoService.GetTodosAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<ActionResult<TodoDto>> PostTodo(TodoDto todoDto)
        {
            var result = await _todoService.CreateTodoAsync(todoDto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodo(int id, TodoDto todoDto)
        {
            var success = await _todoService.UpdateTodoAsync(id, todoDto);
            if (!success)
            {
                return BadRequest(new { message = "更新失敗，請檢查 ID 是否相符或資料是否存在" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var success = await _todoService.DeleteTodoAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}