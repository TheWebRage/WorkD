using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Assignment_2.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Assignment_2.Pages
{
    public class gameModel : PageModel
    {

        public JsonResult OnGetCustomHandler(string username)
        {
            return new JsonResult("");
        }
    }
}
