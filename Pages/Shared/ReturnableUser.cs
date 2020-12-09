using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Pages.Shared
{
    public class ReturnableUser
    {
        public ReturnableUser(string UserName, string Salt, string is_observing, string group_name, string Error)
        {
            this.UserName = UserName;
            this.Salt = Salt;
            this.group_name = group_name;
            this.is_observing = is_observing;
            this.Error = Error;
        }

        public string UserName { get; }
        public string Salt { get; }
        public string is_observing { get; }
        public string group_name { get; }
        public string Error { get; }

    }
}
