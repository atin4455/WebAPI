// Services/TodoService.cs
using WebAPI.BackEnd.Models;
using WebAPI.BackEnd.Models.DTOs;
using WebAPI.BackEnd.Repositories;

namespace WebAPI.BackEnd.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<TodoDto>> GetTodosAsync()
        {
            // 1. 檢查 Repository 有沒有資料（如果 Repository 有 AnyAsync 更好，沒有就先用同步的 Any）
            if (!_todoRepository.Any())
            {
                // 💡 關鍵就在這裡：把原本的 .Wait() 刪掉，在最前面加上 await！
                await _todoRepository.AddAsync(new Todo { Title = "學習 React + .NET WebAPI", IsCompleted = false });
            }

            var todos = await _todoRepository.GetAllAsync();
            // 將 Entity 轉成 DTO
            return todos.Select(t => new TodoDto
            {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted
            });
        }

        public async Task<TodoDto> CreateTodoAsync(TodoDto todoDto)
        {
            var todoEntity = new Todo
            {
                Title = todoDto.Title,
                IsCompleted = todoDto.IsCompleted
            };

            var savedTodo = await _todoRepository.AddAsync(todoEntity);

            todoDto.Id = savedTodo.Id;
            return todoDto;
        }

        public async Task<bool> UpdateTodoAsync(int id, TodoDto todoDto)
        {
            if (id != todoDto.Id) return false;

            var todoEntity = new Todo
            {
                Id = todoDto.Id,
                Title = todoDto.Title,
                IsCompleted = todoDto.IsCompleted
            };

            try
            {
                await _todoRepository.UpdateAsync(todoEntity);
                return true;
            }
            catch (Exception)
            {
                if (!await _todoRepository.ExistsAsync(id)) return false;
                throw;
            }
        }

        public async Task<bool> DeleteTodoAsync(int id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null) return false;

            await _todoRepository.DeleteAsync(todo);
            return true;
        }
    }
}