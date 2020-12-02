using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Connections.Features;
using System;
using System.Linq;
using System.Threading;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Security.Cryptography.X509Certificates;

namespace Assignment_2.Hubs
{
    public class PlayerHub : Hub
    {
        //// holds the list of matches in progress
        //static List<Matches> matches = new List<Matches>();

        //// This holds the connection groups for each player
        //public static Dictionary<string, string> groups = new Dictionary<string, string>();

        //#region Dictionaries
        //// Dictionary
        //public string[] twoLetters = new string[] { "to", "hi", "up", "be", "as", "am", "an", "at", "go", "if", "in", "is", "it", "me", "my", "no", "or", "on", "so", "um", "us" };
        //public string[] threeLetters = new string[] { "age", "ace", "act", "add", "ago", "bed", "bad", "dog", "cat", "few", "gas", "lid", "nap", "mad", "nut", "oar", "off", "pop", "sea", "spa", "the" };
        //public string[] fourLetters = new string[] { "able", "also", "bird", "busy", "camp", "farm", "gold", "have", "jump", "less", "need", "much", "race", "self", "test", "view", "wait", "yeah", "well", "zone", "your" };
        //public string[] fiveLetters = new string[] { "about", "after", "again", "close", "daily", "fight", "finds", "guess", "items", "looks", "music", "often", "paper", "price", "ratio", "shoes", "story", "teeth", "watch", "worth", "trick" };
        //public string[] sixLetters = new string[] { "action", "battle", "circle", "debate", "energy", "father", "garage", "having", "island", "laptop", "market", "nation", "option", "person", "random", "school", "thanks", "unable", "weight", "yellow", "defend" };
        //public string[] sevenLetters = new string[] { "ability", "believe", "careful", "evening", "factory", "general", "illegal", "leaving", "manager", "musical", "nothing", "obvious", "outside", "perfect", "product", "regular", "science", "teacher", "trouble", "weekend", "traffic" };
        //public string[] eightLetters = new string[] { "accuracy", "anywhere", "complete", "creative", "discount", "employee", "facility", "football", "keyboard", "negative", "painting", "possible", "reaction", "standard", "terrible", "whatever", "aviation", "colorful", "disagree", "explorer", "governor" };
        //#endregion

        //static int numMatches = 1;
        //static string waitingPlayer = string.Empty;

        ///// <summary>
        ///// receives the username of the person logged in. If two people have signed in the game starts
        ///// </summary>
        ///// <param name="user">the user that has logged in</param>
        ///// <returns></returns>
        //public async Task SendUser(string user)
        //{

        //    if (groups.ContainsKey(user))
        //    {
        //        try
        //        {
        //            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groups[user]);
        //        }
        //        finally
        //        {
        //            groups.Remove(user);
        //        }
        //    }

        //    await Groups.AddToGroupAsync(Context.ConnectionId, numMatches.ToString());
        //    groups.Add(user, numMatches.ToString());

        //    //if there are no matches in the matches list
        //    if(waitingPlayer == string.Empty)
        //    {
        //        //Keeps track of the player who joined first
        //        waitingPlayer = user;
        //    }
        //    // this runs when the second player joins
        //    else
        //    {
        //        // creates the new match
        //        Matches temp = new Matches(Clients, waitingPlayer, user);
        //        matches.Add(temp);

        //        // resets the waiting player
        //        waitingPlayer = string.Empty;

        //        // creates the game loop in a new thread
        //        Thread gameLoop = new Thread(new ParameterizedThreadStart(startGame));
        //        gameLoop.Start(numMatches++);

        //        // sets the match id back to 0 if the integer wraps around
        //        if(numMatches < 0)
        //        {
        //            numMatches = 1;
        //        }

        //    }

        //}

        //#region gameLoop
        ///// <summary>
        ///// runs the game on the server
        ///// </summary>
        //private void startGame(object OBJ)

        //{
        //    int instance = (int)OBJ -1;
        //    matches[instance].setGameIsRunning(true);
        //    Int16 sleepTime = 3000;
        //    int iterations = 0;


        //    matches[instance].newWords(getRandomWords());
        //    Thread.Sleep(sleepTime);
        //    matches[instance].newWords(getRandomWords());

        //    Thread.Sleep(sleepTime);

        //    sleepTime = 1000;
        //    do
        //    {
        //       ++iterations;
        //        string winnerName = matches[instance].CheckWordTime();
        //       if (winnerName != string.Empty)
        //        {
        //            matches[instance].setGameIsRunning(false);
        //            matches[instance].ReceiveWinner(winnerName);
        //        } 
        //       Thread.Sleep(sleepTime);
        //       if(iterations > 6)
        //       {
        //            iterations = 0;

        //            matches[instance].newWords(getRandomWords());

        //       }

        //    } while (matches[instance].getGameIsRunning());
            
        //}

        ///// <summary>
        ///// Gets a match with the given player name
        ///// </summary>
        ///// <param name="playerName">The name of the player to find their match</param>
        ///// <returns>The match that contains the given player name</returns>
        //public Matches GetMatchFromPlayerName(string playerName)
        //{
        //    foreach (var match in matches)
        //    {
        //        if (match.hasPlayer(playerName))
        //        {
        //            return match;
        //        }
        //    }

        //    throw new Exception("Match wasn't found with the given player name");
        //}


        ///// <summary>
        ///// any time a player types a letter it is sent to this function
        ///// </summary>
        ///// <param name="user"></param>
        ///// <param name="message"></param>
        ///// <returns></returns>
        //public async Task SendKeyPress(string user, string message)
        //{
        //    Matches match = GetMatchFromPlayerName(user);
        //    int matchIndex;
        //    for(matchIndex = 0; matchIndex < matches.Count(); matchIndex++)
        //    {
        //        if (matches[matchIndex].hasPlayer(user))
        //        {
        //            break;
        //        }
        //    }

        //    // Keep list of both current users and strings
        //    //  - only add if the string is possible for word options
        //    // Index 0 for matched word, index 1 for the rest of the string
        //    string[] strings = match.receiveKeyPress(user, message);

        //    matches[matchIndex].SetPlayerTypedChars(user,strings[0]);

        //    string otherUser = match.GetOtherUsername(user);

        //    if (strings[1] != string.Empty)
        //    {
        //        await SendWordToOnePlayer(otherUser, strings[1].Length);
        //        await Clients.Groups(groups[user]).SendAsync("ReceiveDeletedWord", user, strings[1]);

        //    }
        //    await Clients.Groups(groups[user]).SendAsync("ReceiveKeyPress", user, strings[0]);
        //}


        ///// <summary>
        ///// Sends a word to one player, just after the other player finishes a word
        ///// </summary>
        ///// <returns></returns>
        //public async Task SendWordToOnePlayer(string user, int wordLength)
        //{
        //    Matches match = GetMatchFromPlayerName(user);
        //    string word = getWordOfLength(wordLength);

        //    await match.SendOneWord(user, word);
        //    match.AddPlayerWordOptions(user, word);
        //}

        //#endregion


        ///// <summary>
        ///// returns two words in a string[]
        ///// </summary>
        ///// <returns>string[] containing two words</returns>
        //public string[] getRandomWords() // Nate says Daniel is weird
        //{
        //    System.Random random = new System.Random();

        //    string[] randomWords = new string[2];

        //    // Randomly select which array (length of words)
        //    int amount = random.Next(2, 9);

        //    // Randomly select which word in the array
        //    int r1 = random.Next(0, 21);
        //    int r2 = random.Next(0, 21);

        //    // Add the random words to the randomWords array
        //    switch (amount)
        //    {
        //        case 2:
        //            randomWords[0] = twoLetters[r1];
        //            randomWords[1] = twoLetters[r2];
        //            break;
        //        case 3:
        //            randomWords[0] = threeLetters[r1];
        //            randomWords[1] = threeLetters[r2];
        //            break;
        //        case 4:
        //            randomWords[0] = fourLetters[r1];
        //            randomWords[1] = fourLetters[r2];
        //            break;
        //        case 5:
        //            randomWords[0] = fiveLetters[r1];
        //            randomWords[1] = fiveLetters[r2];
        //            break;
        //        case 6:
        //            randomWords[0] = sixLetters[r1];
        //            randomWords[1] = sixLetters[r2];
        //            break;
        //        case 7:
        //            randomWords[0] = sevenLetters[r1];
        //            randomWords[1] = sevenLetters[r2];
        //            break;
        //        case 8:
        //            randomWords[0] = eightLetters[r1];
        //            randomWords[1] = eightLetters[r2];
        //            break;
        //    }

        //    return randomWords;
        //}

        ///// <summary>
        ///// returns a word of the given length
        ///// </summary>
        ///// <returns>string containing the random word</returns>
        //public string getWordOfLength(int length)
        //{
        //    Random random = new Random();

        //    string randomWord = "";

        //    // Randomly select which word in the array
        //    int r = random.Next(0, 21);

        //    // Add the random words to the randomWords array
        //    switch (length)
        //    {
        //        case 2:
        //            randomWord = twoLetters[r];
        //            break;
        //        case 3:
        //            randomWord = threeLetters[r];
        //            break;
        //        case 4:
        //            randomWord = fourLetters[r];
        //            break;
        //        case 5:
        //            randomWord = fiveLetters[r];
        //            break;
        //        case 6:
        //            randomWord = sixLetters[r];
        //            break;
        //        case 7:
        //            randomWord = sevenLetters[r];
        //            break;
        //        case 8:
        //            randomWord = eightLetters[r];
        //            break;
        //    }

        //    return randomWord;
        //}
    }
}