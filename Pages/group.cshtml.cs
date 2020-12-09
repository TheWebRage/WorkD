using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Assignment_2.Data;
using Assignment_2.Models;
using Assignment_2.Pages.Shared;

namespace Assignment_2.Pages
{
    public class groupModel : PageModel
    {
        public void OnGet()
        {

        }

        private readonly Assignment_2.Data.Assignment_2Context _context;

        public groupModel(Assignment_2.Data.Assignment_2Context context)
        {
            _context = context;
        }

        /// <summary>
        /// returns the time log object as a Json object
        /// </summary>
        /// <returns>JSON</returns>
        public ActionResult OnPostTimeEntries()
        {

            string groupName = Request.Form["groupName"].First();
            var groupData = _context.TimeLog.Where(x => x.User.Group.Name == groupName);


            return new JsonResult(groupData);
        }


        /// <summary>
        /// returns a list of all of the groups
        /// </summary>
        /// <returns>JSON object</returns>
        public JsonResult OnPostGroups()
        {
            List<string> groups = new List<string>();

            //foreach(var group in _context.Group)
            //{
            //    groups.Add(group.Name);
            //}
            groups.Add("Group1");
            groups.Add("Group2");
            groups.Add("Winne Hut Juniors");
            groups.Add("Super Wennie Hut Juniors");
            groups.Add("I hope this t");


            return new JsonResult(groups);

        }
    }
}
