using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Assignment_2.Models;

namespace Assignment_2.Data
{
    public class Assignment_2Context : DbContext
    {
        public Assignment_2Context(DbContextOptions<Assignment_2Context> options)
            : base(options)
        {
        }

        public DbSet<Assignment_2.Models.User> User { get; set; }
        public DbSet<Assignment_2.Models.Group> Group { get; set; }
        public DbSet<Assignment_2.Models.TimeLog> TimeLog { get; set; }
    }
}
