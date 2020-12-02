using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Models
{
    public class User
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string IsAdmin { get; set; }
    }

    public class TimeLog
    {
        public int ID { get; set; }
        public User User { get; set; }
        public DateTime StarTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Description { get; set; }
    }

    public class Group
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}
