using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Pages.Shared
{
    public class ReturnableUser
    {
        public ReturnableUser(string UserName, string Salt, string Error)
        {
            this.UserName = UserName;
            this.Salt = Salt;
            this.Error = Error;
        }

        public string UserName { get; }
        public string Salt { get; }
        public string Error { get; }

    }
}
