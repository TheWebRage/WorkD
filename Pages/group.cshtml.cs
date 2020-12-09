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
        #region notRelevant
        public void OnGet()
        {}

        private readonly Assignment_2.Data.Assignment_2Context _context;

        public groupModel(Assignment_2.Data.Assignment_2Context context)
        {
            _context = context;
        }
        #endregion//cleaned up code that is not normally viewed

        /// <summary>
        /// returns the time log object as a Json object
        /// </summary>
        /// <returns>JSON</returns>
        public ActionResult OnPostTimeEntries()
        {
            try
            {
                string groupName = Request.Form["groupName"].First();

                List<TimeLog> TimeLogList = new List<TimeLog>();

                for (int i = 0; i < _context.TimeLog.Count(); i++){
                    if (_context.TimeLog.ToArray()[i].User.Group.Name == groupName)
                    {
                        TimeLog timeLogEntry = _context.TimeLog.ToArray()[i];
                        TimeLogList.Add(timeLogEntry);
                    }
                    
                }

                return new JsonResult(TimeLogList);
            }
            catch(Exception e)
            {
                Console.WriteLine("Exception thrown " + e.Message + ". Probably because there was no info in the data base");
                List<TimeLog> timeLogList = new List<TimeLog>();
                TimeLog emptyTimeLog = new TimeLog();
                timeLogList.Add(emptyTimeLog);

                return new JsonResult(timeLogList);
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

        /// <summary>
        /// this function is called to save time entries to the database
        /// </summary>
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


            int index = 0;
            for ( int j = 0; j < _context.User.Count(); j++)
            {
                if(_context.User.ToArray()[j].UserName == Request.Form["name"].First()){
                    index = j;
                    break;
                }
            }


            TimeLog newTimeEntry = new TimeLog
            {
                StarTime = tempStartTime,
                EndTime = tempEndTime,
                UserID = _context.User.ToArray()[index].ID,
                User = _context.User.ToArray()[index],
                Description = Request.Form["Description"].First()
            };

            _context.TimeLog.Add(newTimeEntry);
            _context.SaveChanges();
        }
    }
}
