using WebAPI.BackEnd.Models;

namespace WebAPI.BackEnd.Repositories
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetAllAsync();
        Task<Todo?> GetByIdAsync(int id);
        Task<Todo> AddAsync(Todo todo);
        Task UpdateAsync(Todo todo);
        Task DeleteAsync(Todo todo);
        Task<bool> ExistsAsync(int id);
        bool Any(); // 供初始化檢查使用
    }
}
