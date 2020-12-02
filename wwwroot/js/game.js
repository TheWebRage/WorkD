let boardX = 0;         //The x percentage of the screen the words start appearing at
let boardWidth = 85;    //The spot the words stop appearing is boardX + boardWidth

let localUser = getCookie('username');

if (localUser == "" || localUser == null) {
    window.location.replace("/");
}

let remoteUser;         //is set when the game starts

let localWords = [];    //Stores the words currently on the player's screen
let remoteWords = [];   //Stores the words on the opponent's screen

let gameStarted = false;

//creates the connection with the player hub
let connection = new signalR.HubConnectionBuilder().withUrl("/PlayerHub").build();

//Div that shows to grey out the screen
let tint = document.createElement('div');
tint.style.position = 'fixed';
tint.style.height = '100vh';
tint.style.width = '100vw';
tint.style.left = '0px';
tint.style.top = '0px';
tint.style.backgroundColor = '#AAAAAA'
tint.style.opacity = '50%';
tint.style.textAlign = 'center';
tint.style.fontSize = '5em';
tint.style.verticalAlign = 'middle';
document.querySelector('body').appendChild(tint);

//Button that starts the game
let button = document.createElement('button');
button.onclick = ready;
button.innerHTML = 'Start Game';
button.style.width = '40%';
button.style.height = '15%'
button.style.position = 'fixed';
button.style.left = '30%';
button.style.top = '42.5%';
button.style.fontSize = '4em';
document.querySelector('body').appendChild(button);

//Ready message that is added when the start game button is clicked and before the other user does
let readyMessage = document.createElement('p');
readyMessage.innerHTML = 'Waiting on Opponent';
readyMessage.style.width = '40%';
readyMessage.style.height = '15%'
readyMessage.style.position = 'fixed';
readyMessage.style.left = '30%';
readyMessage.style.top = '42.5%';
readyMessage.style.fontSize = '5em';
readyMessage.style.opacity = '50%';

//Starts the connection?
connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});

///////////////////////////////////////////////////
//  Local Functions ///////////////////////////////
///////////////////////////////////////////////////

//returns true if a string is a single character letter
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

//Gets the cookie with the given name
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//Tells the server the client is ready for the game to start
function ready() {
    connection.invoke("SendUser", localUser).catch(function (err) {
        return console.error(err.toString());
    });

    button.remove();
    document.querySelector('body').appendChild(readyMessage);

    //Uncomment for testing purposes
    //startGame();
}

//Removes stuff in the way when the game starts
function startGame() {
    tint.remove();
    readyMessage.remove();

    gameStarted = true;

    //Now puts usernames above the gameboards
    let local = document.createElement('p');
    let remote = document.createElement('p');

    local.className = 'username';
    remote.className = 'username';

    //positioning for usernames
    local.style.left = '20%';
    remote.style.right = '20%';

    local.innerHTML = localUser;
    remote.innerHTML = remoteUser;

    document.querySelector('body').appendChild(local);
    document.querySelector('body').appendChild(remote);
}

//Creates a word and adds it to the correct board
function CreateWord(user, message) {
    //console.log(user + ' ' + message);

    let location;
    if (user === localUser) {
        location = 'local';
    }
    else {
        location = 'remote';
    }

    //Creates the DOM element for the new word.
    let word = document.createElement('div');
    word.className = 'word';
    word.innerHTML = message;
    word.id = location + '-' + message;
    word.style.left = (Math.random() * boardWidth) + boardX + "%";
    //console.log('Creating Word: ' + message);

    //Adds the word to the corresponding board.
    if (location === 'local') {
        localWords.push(word.innerHTML);
        document.getElementById('local-board').appendChild(word)
    }
    else {
        remoteWords.push(word.innerHTML);
        document.getElementById('remote-board').appendChild(word)
    }
}

function DeleteWord(user, message) {

    //First checks for the word on the local list
    if (user === localUser) {
        for (let w of localWords) {
            if (w === message) {
                //Removes the DOM element
                document.getElementById('local-' + w).remove();

                //Removes the word from the list
                localWords = localWords.filter(function (value, index, array) {return value !== w });
                //console.log('Removing local word: ' + w);
            }
        }
    }

    //Checks for the word on the remote list
    else {
        for (let w of remoteWords) {
            if (w === message) {
                document.getElementById('remote-' + w).remove();

                remoteWords = remoteWords.filter(function (value, index, array) { return value !== w });
                //console.log('Removing remote word: ' + w);
            }
        }
    }

}

//Uses the message sent from the server to highlight the typed characters in the applicable words
function HighlightLetters(user, message) {
    let wordList, location;

    //Configures variables based on who's letters need highlighting
    if (user === localUser) {
        location = 'local';
        wordList = localWords;
    }
    else {
        location = 'remote';
        wordList = remoteWords;
    }

    //Highlights the part of the word that was returned by the server
    for (let w of wordList) {
        let found = false;
        let length = 0;
        for (let i = message.length - 1; i >= 0; i--) {
            length++;
            if (w.substring(0, length) === message.substring(i, 1000)) {
                //Holds the element that matches
                let e = document.querySelector('#' + location + '-' + w);

                //Has to check for null, the word could be on the other board
                if (e !== null) {
                    e.innerHTML = '<strong>' + w.substring(0, length) + '</strong>' + w.substring(length, 1000);
                    found = true;
                    //console.log('Character string found: ' + message.substring(i, 1000));
                }
            }
            else {
                //console.log('Message substring: ->' + message.substring(i, 1000) + '<- Does not equal word substring: ->' + w.substring(0, length) + '<-');
            }
        }

        //Resets the word back to being unbolded if the word isn't found
        if (!found && document.querySelector('#' + location + '-' + w) !== null) {
            document.querySelector('#' + location + '-' + w).innerHTML = w;
        }
    }
}

//Shows a message showing whether the player won or lost
function ShowWinner(user) {
    let title;
    let message;

    if (user === localUser) {
        title = "You Win!";
        message = "Congratulations! You're the quicker typist.";
    }
    else {
        title = "You Lose!";
        message = "Keep practicing and maybe one day you'll win.";
    }

    document.getElementById('local-board').remove();
    document.getElementById('remote-board').remove();

    let messageTitle = document.createElement('p');
    messageTitle.innerHTML = title;
    messageTitle.className = 'results-title';

    let messageBody = document.createElement('p');
    messageBody.innerHTML = message;
    messageBody.className = 'results-body';

    let button = document.createElement('button');
    button.innerHTML = "Play Again?";
    button.className = 'result-button';
    button.onclick = function () {
        location.href = 'game';
    }

    let resultScreen = document.createElement('div');
    resultScreen.className = 'results';

    resultScreen.appendChild(messageTitle);
    resultScreen.appendChild(messageBody);
    resultScreen.appendChild(button);
    document.querySelector('body').appendChild(resultScreen);

    //Gets rid of the usernames when the win/loss screen shows
    usernames = document.getElementsByClassName('username');
    usernames[0].remove();
    usernames = document.getElementsByClassName('username');
    usernames[0].remove();
}

//Gets the key pressed and sends it as a message to the server
window.onkeypress = function (e) {
   if (gameStarted) {
        //Gets the character corresponding to the key code
        //The e.which makes it cross compatible with Firefox
        let message = String.fromCharCode(e.which || e.keyCode);

        message = message.toLowerCase();

        if (isLetter(message)) {
            console.log("User: " + localUser + "Sending keypress: " + message);

            connection.invoke("SendKeyPress", localUser, message).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }
}

/////////////////////////////////////////////////////
//  Communications with Server  /////////////////////
/////////////////////////////////////////////////////

//Receives the last 8 characters typed by the player
connection.on("ReceiveKeyPress", function(user, message) {
    HighlightLetters(user, message);
    console.log("Here's the message (after keypress) from the server: " + message + " user: " + user);
});

//Receives a word from the server and deletes it from the board
connection.on("ReceiveDeletedWord", function (user, message) {
    DeleteWord(user, message);
});

//Receives a word from the server and adds it to the board.
connection.on("ReceiveNewWord", function (user, message) {
    CreateWord(user, message);
});

//Receives the winner from the server and displays a message on the screen
connection.on("ReceiveWinner", function (user) {
    ShowWinner(user);
});

//Receives the names of both users when the game is supposed to start
//Splits the names and stores the remote username
connection.on("ReceiveUser", function (users) {
    let names = users.split(',');
    for (let n of names) {
        if (localUser !== n) {
            remoteUser = n;
        }
    }

    //Cleans up the screen for the start of the game
    startGame();
});

//Tells the server the player is ready for the game to start
//connection.invoke("SendUser", localUser).catch(function (err) {
//    return console.error(err.toString());
//});



//Makes it much easier to test the game until server messages are working
function Test() {
    CreateWord("Test", "bored");
    CreateWord("Test", "restaurant");
    CreateWord("Joe", "tired");
    CreateWord("Joe", "retired");
    HighlightLetters('Test', 'abcbore');
    HighlightLetters('Joe', 'abctire');
    //ShowWinner("Bob");
    //ShowWinner("Joe");
    CreateWord("Test", "Nothing");
    DeleteWord("Test", "Nothing");
    CreateWord("Joe", "Something");
    DeleteWord("Joe", "Something");

    HighlightLetters('Test', 'abcdefgtired');
}

//Test();