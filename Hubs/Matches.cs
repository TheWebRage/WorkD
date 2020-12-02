using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Assignment_2.Hubs
{
    public class Matches
    {
        // Search based on the user for their data
        private Dictionary<string, string> playerTypedChars = new Dictionary<string, string>();
        private Dictionary<string, LinkedList<Word>> playerWordOptions = new Dictionary<string, LinkedList<Word>>();
        private bool gameIsRunning = false;
        private IHubCallerClients CallerClients;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="cli"></param>
        /// <param name="user1">the order for the two users does not matter</param>
        /// <param name="user2"></param>
        public Matches(IHubCallerClients cli, string user1, string user2)
        {
            CallerClients = cli;
            addPlayer(user1);
            addPlayer(user2);

            CallerClients.Groups(PlayerHub.groups[user1]).SendAsync("ReceiveUser", generateUserString());
        }


        /// <summary>
        /// adds the player's name passed in to the Dictionaries in Matches
        /// </summary>
        /// <param name="user">String containing the user name</param>
        /// <returns>True if it was successful</returns>
        private bool addPlayer(string user)
        {
            if (playerTypedChars.Count > 2)
            {
                return false;
            }
            // Store users in dictionaries
            playerTypedChars.Add(user, string.Empty);
            playerWordOptions.Add(user, new LinkedList<Word>());

            return true;
        }

        /// <summary>
        /// Returns true if the match contains two player and false if it does not
        /// </summary>
        /// <returns>Returns true if the match contains two player and false if it does not</returns>
        public bool hasTwoPlayers()
        {
            if (playerTypedChars.Count == 2)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Generates a string containing the names of both users separated by a , that is to be sent to the front end
        /// </summary>
        /// <returns>returns a string</returns>
        private string generateUserString()
        {
            return playerTypedChars.ElementAt(0).Key + "," + playerTypedChars.ElementAt(1).Key;
        }

        /// <summary>
        /// if the game is running pass in true if it is not pass in false
        /// </summary>
        /// <param name="setting"></param>
        public void setGameIsRunning(bool setting)
        {
            gameIsRunning = setting;
        }

        /// <summary>
        /// gets value of GameIsRunning
        /// </summary>
        /// <returns>bool</returns>
        public bool getGameIsRunning()
        {
            return gameIsRunning;
        }

        /// <summary>
        /// checks to see if this match object contains the user passed in
        /// </summary>
        /// <param name="userName">the user to search</param>
        /// <returns></returns>
        public bool hasPlayer(string userName)
        {
            return playerTypedChars.ContainsKey(userName);
        }

        /// <summary>
        /// makes sure that the words for the players are still valid
        /// </summary>
        /// <returns>the winner if someone dropped a word, or string.Empty if not</returns>
        public string CheckWordTime()
        {

            //checks to see if any of the words need to be deleted
            foreach (var item in playerWordOptions) //one instance of the dictionary
            {
                for (int i = 0; i < item.Value.Count; i++) //for every item in the linked list
                {
                    if (item.Value.ElementAt(i).timePassed() > 10) //checks if the word has existed for longer than 10 seconds
                    {
                        for (int j = 0; j < 2; j++)
                        {
                            if (playerWordOptions.ElementAt(j).Key != item.Key)
                            {
                                //ReceiveWinner(playerWordOptions.ElementAt(j).Key);
                                return playerWordOptions.ElementAt(j).Key;
                            }
                        }
                    }
                }
            }

            return string.Empty;
        }

        /// <summary>
        /// no longer an issue
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns>a string array [0] will contain the leftover letters the user typed [1] will contain a the word that matches a word in the dictionaries</returns>
        public string[] receiveKeyPress(string user, string message)
        {
            message = playerTypedChars[user] + message;
            string[] returnString = new string[2];
            returnString[1] = string.Empty;

            foreach (var word in playerWordOptions[user])
            {
                if (message.Contains(word.ToString()))
                {
                    // Send completed word to front
                    // remove word from word options

                    playerWordOptions[user].Remove(word);
                    playerTypedChars[user] = "";

                    returnString[1] = word.ToString();

                    break;
                }
            }

            // Trims the message
            if (message.Length > 8)
            {
                message = message.Remove(0, 1);
            }

            playerTypedChars[user] = message;
            returnString[0] = message;

            return returnString;
        }

        /// <summary>
        /// sends the two new words to the players in the match 
        /// </summary>
        /// <param name="words">the two words to be passed to </param>
        public async void newWords(string[] words)
        {
            //sending the words to the clients
            int i = 0;
            foreach (var playerUser in playerWordOptions)
            {
                await CallerClients.Groups(PlayerHub.groups[playerUser.Key]).SendAsync("ReceiveNewWord", playerUser.Key, words[i]);

                Word temp = new Word(words[i]);
                playerWordOptions[playerUser.Key].AddLast(temp);
                i++;
            }
        }

        /// <summary>
        /// will send a websocket notification containing the name of the player that one
        /// </summary>
        /// <param name="playerName"></param>
        /// <returns></returns>
        public async Task ReceiveWinner(string playerName)
        {
            gameIsRunning = false;

            await CallerClients.Groups(PlayerHub.groups[playerName]).SendAsync("ReceiveWinner", playerName);

            playerTypedChars.Clear();
            //this was just to be sure that we don't leak memory.
            foreach (var item in playerWordOptions)
            {
                item.Value.Clear();
            }
            playerWordOptions.Clear();
        }

        #region Getters and Setters
        /// <summary>
        /// Setter for playerTypedChars
        /// </summary>
        /// <param name="user">The player to send the new word</param>
        /// <param name="value">The new word to send</param>
        public void SetPlayerTypedChars(string user, string value)
        {
            playerTypedChars[user] = value;
        }

        /// <summary>
        /// Adds a word to the playerWordOptions
        /// </summary>
        /// <param name="user">the player the word is added to</param>
        /// <param name="word">the word being added</param>
        public void AddPlayerWordOptions(string user, string word)
        {
            playerWordOptions[user].AddLast(new Word(word));
        }

        /// <summary>
        /// Sends a word to just one player
        /// </summary>
        /// <param name="user">The user to send the word to</param>
        /// <param name="word">The word being sent</param>
        /// <returns></returns>
        public async Task SendOneWord(string user, string word)
        {
            string otherPlayer = GetOtherUsername(user);

            await CallerClients.Groups(PlayerHub.groups[user]).SendAsync("ReceiveNewWord", user, word);
        }

        /// <summary>
        /// Gets the usernames in the match
        /// </summary>
        /// <returns>A string array with the usernames</returns>
        public string[] GetUsernames()
        {
            return playerTypedChars.Keys.ToArray();
        }

        /// <summary>
        /// Returns the username for the other player in a match
        /// </summary>
        /// <param name="username">The username for the first player</param>
        /// <returns>the username for the other player</returns>
        public string GetOtherUsername(string username)
        {
            foreach (string user in playerTypedChars.Keys.ToArray())
            {
                if(user != username)
                {
                    return user;
                }
            }

            return "";
        }


        public override string ToString()
        {
            return generateUserString();
        }
        #endregion
    }
}
