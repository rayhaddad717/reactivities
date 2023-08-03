using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options){

        }
        
    //this represents our table name when created in database
    public DbSet<Activity> Activities { get; set; } 
    }
}