using Microsoft.EntityFrameworkCore;
using WebAPI.BackEnd.Models;

namespace WebAPI.BackEnd.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Todo> Todos { get; set; }
}