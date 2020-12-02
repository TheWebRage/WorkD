using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Assignment_2.Data;
using Assignment_2.Models;

namespace Assignment_2.Pages.Users
{
    public class LogoutModel : PageModel
    {
        private readonly Assignment_2.Data.Assignment_2Context _context;

        public LogoutModel(Assignment_2.Data.Assignment_2Context context)
        {
            _context = context;
        }

        [BindProperty]
        public User User { get; set; }

    }
}
