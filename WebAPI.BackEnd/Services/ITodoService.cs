using WebAPI.BackEnd.Models.DTOs;

namespace WebAPI.BackEnd.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoDto>> GetTodosAsync();
        Task<TodoDto> CreateTodoAsync(TodoDto todoDto);
        Task<bool> UpdateTodoAsync(int id, TodoDto todoDto);
        Task<bool> DeleteTodoAsync(int id);
    }
}
