using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Hubs
{
    #region WordObjects
    /// <summary>
    /// a data type containing a string "word" and DateTime "created"
    /// </summary>
    struct Word
    {
        private string word;
        private DateTime created;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="passedIn">the word to be saved in Word</param>
        public Word(string passedIn)
        {
            word = passedIn;
            created = DateTime.Now;
        }

        /// <summary>
        /// returns the how many seconds have passed since creation of this Instance of Word
        /// </summary>
        /// <returns>int</returns>
        public int timePassed()
        {
            DateTime now = DateTime.Now;
            TimeSpan timeSpan = now - created;
            return timeSpan.Seconds;
        }

        /// <summary>
        /// returns the word stored in Word as a string
        /// </summary>
        /// <returns>string</returns>
        public override string ToString() => word;
    }
    #endregion
}
