using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Models
{
    public class TimeLog
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime StarTime { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime EndTime { get; set; }
        public string Description { get; set; }
    }
}
