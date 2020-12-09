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
    public class LoginModel : PageModel
    {
        private readonly Assignment_2.Data.Assignment_2Context _context;

        public LoginModel(Assignment_2.Data.Assignment_2Context context)
        {
            _context = context;
        }
        public JsonResult OnPost()
        {
            if (!_context.User.Any())
            {
                var returnable = new ReturnableUser("", "", "", "", "No users in Database.");
                return new JsonResult(returnable);
            }

            string username = Request.Form["username"];
            string passwordHash = Request.Form["passwordHash"];

            User userObj = _context.User.Where(x => x.UserName == username).First();
            string error = "";
            string is_observing = "";
            string group_name = "";

            if (userObj.ID <= 0)
            {
                error = "Username not found.";
            }
            else if (passwordHash != "" && userObj.PasswordHash != passwordHash)
            {
                error = "Password is incorrect.";
            }
            else
            {
                is_observing = userObj.IsObserver;
                group_name = _context.Group.First(x => x.ID == userObj.GroupID).Name;
            }

            var returnableUser = new ReturnableUser(userObj.UserName, userObj.Salt, is_observing, group_name, error);
            return new JsonResult(returnableUser);
        }

    }
}
