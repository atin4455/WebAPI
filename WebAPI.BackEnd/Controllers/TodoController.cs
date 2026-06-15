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

    // 3. 【PUT】 修改待辦事項的狀態 (對應前端勾選完成/未完成)
    // 網址：PUT https://localhost:7112/api/todo/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodo(int id, Todo todo)
    {
        // 防呆：如果網址傳進來的 id 跟內容包的 id 對不起來，就報錯
        if (id != todo.Id)
        {
            return BadRequest();
        }

        // 告訴 Entity Framework 這個物件已經被修改了
        _context.Entry(todo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // 如果剛好資料在記憶體裡消失了，就回傳找不到
            if (!_context.Todos.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent(); // 回傳 204 No Content，代表修改成功但不用吐回大資料
    }

    // 4. 【DELETE】 刪除一筆待辦事項
    // 網址：DELETE https://localhost:7112/api/todo/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            return NotFound();
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return NoContent(); // 刪除成功，回傳 204
    }
}