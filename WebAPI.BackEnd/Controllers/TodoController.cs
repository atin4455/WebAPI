using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.BackEnd.Data;
using WebAPI.BackEnd.Models;

namespace WebAPI.BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")] // 網址：api/todo
public class TodoController : ControllerBase
{
    private readonly AppDbContext _context;

    // 1. 建構子：負責初始化和注入 DbContext
    public TodoController(AppDbContext context)
    {
        _context = context;

        // 💡 預設塞一筆資料，免得等一下測試時空空的以為壞掉
        if (!_context.Todos.Any())
        {
            _context.Todos.Add(new Todo { Title = "學習 React + .NET WebAPI", IsCompleted = false });
            _context.SaveChanges();
        }
    }

    // 🌟 【你漏掉的 GET 大門】
    // 當你輸入 https://localhost:7112/api/todo 時，系統會自動跑來這裡！
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
    {
        var list = await _context.Todos.ToListAsync();
        return Ok(list); // 回傳 200 OK 和資料清單
    }

    // 🌟 【你漏掉的 POST 大門】
    // 當你用 Postman 或 HTTP 檔案發送 POST 請求時，系統會自動跑來這裡！
    [HttpPost]
    public async Task<ActionResult<Todo>> PostTodo(Todo todo)
    {
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return Ok(todo); // 回傳成功新增的物件
    }
}