using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Assignment_2.Data;
using Assignment_2.Models;
using Assignment_2.Pages.Shared;

namespace Assignment_2.Pages.Users
{
    public class CreateModel : PageModel
    {
        private readonly Assignment_2.Data.Assignment_2Context _context;

        public CreateModel(Assignment_2.Data.Assignment_2Context context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        //[BindProperty]
        //public User createUser { get; set; }

        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://aka.ms/RazorPagesCRUD.
        public JsonResult OnPost()
        {
            string username = Request.Form["username"].First();
            string passwordHash = Request.Form["passwordHash"].First();
            string salt = Request.Form["salt"].First();

            var userObjArray = _context.User.Where(x => x.UserName == username);
            string error = "";
            
            if (userObjArray.Any())
            {
                error = "Username already exists.";
            }
            else
            {
                User createdUser = new User
                {
                    UserName = username,
                    PasswordHash = passwordHash,
                    Salt = salt
                };
                _context.User.Add(createdUser);
                _context.SaveChanges();
            }

            var returnableUser = new ReturnableUser("", "", error);
            return new JsonResult(returnableUser);
        }
    }
}
