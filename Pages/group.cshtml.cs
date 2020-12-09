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
            try
            {
                string groupName = Request.Form["groupName"].First();
                var groupData = _context.TimeLog.Where(x => x.User.Group.Name == groupName);

                return new JsonResult(groupData);
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception thrown " + e.Message + ". Probably because there was no info in the data base");
                TimeLog emptyTimeLog = new TimeLog();

                return new JsonResult(emptyTimeLog);
            }            
        }


        /// <summary>
        /// returns a list of all of the groups
        /// </summary>
        /// <returns>JSON object</returns>
        public JsonResult OnPostGroups()
        {
            try
            {
                List<string> groups = new List<string>();

                for (int i = 0; i < _context.Group.Count(); i++)
                {
                    groups.Add(_context.Group.ToArray()[i].Name);
                }

                return new JsonResult(groups);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception thrown " + e.Message + ". Probably because there was no info in the data base");
                List<string> groups = new List<string>();
                groups.Add("null");
                return new JsonResult(groups);
            }

        }


        public void OnPostSubmitTime()
        {
            DateTime tempStartTime;
            DateTime tempEndTime;

            try
            {
                tempStartTime = DateTime.Parse(Request.Form["StartTime"].First());
                tempEndTime = DateTime.Parse(Request.Form["EndTime"].First());
            }
            catch (FormatException)
            {
                Console.WriteLine("Unable to parse the specified date");
                return;
            }
            

            TimeLog newTimeEntry = new TimeLog
            {
                StartTime = tempStartTime,
                EndTime = tempEndTime,
                UserID = _context.User.Find(Request.Form["name"].First()).ID,
                User = _context.User.Find(Request.Form["name"].First()),
                Description = Request.Form["Description"].First()
            };

            _context.TimeLog.Add(newTimeEntry);
            _context.SaveChanges();
        }
    }
}
