using Microsoft.EntityFrameworkCore;
using WebAPI.BackEnd.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. 註冊 InMemory 資料庫
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("TodoListDb"));

// 2. 開放 CORS 權限給前端 React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:61780") // 這是前端 Vite 的預設 Port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// 3. 這是最新 .NET 的 OpenAPI 註冊方式 (取代舊的 AddSwaggerGen)
builder.Services.AddOpenApi();

var app = builder.Build();

// 4. 這是最新 .NET 開啟 OpenAPI 路由的方式 (取代舊的 UseSwagger)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // 這會產生一個 json 檔案記錄你的 API 長相
}

// 5. CORS 記得放在 Authorization 之前
app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();
app.Run();