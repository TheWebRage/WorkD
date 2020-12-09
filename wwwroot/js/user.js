//import { getCookie, setCookie, checkCookie } from './cookie'

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

function checkCookie() {
    var user = getCookie("username");
    if (user !== "") { 
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user !== "" && user !== null) {
            setCookie("username", user, 365);
        }
    }
}



function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generatePasswordString(salt, password) {
    let passwordHash = password + salt;

    for (let i = 0; i < 1000; i++) {
        passwordHash = CryptoJS.SHA256(passwordHash);
    }

    return passwordHash;
}

function submitUserForm() {
    let username_raw = document.getElementById("username_raw").value;
    let group_name = d3.select('#combobox').node().value;
    let is_observer = $('#is-observer').value;

    if (username_raw.length < 4) {
        displayError('Username must be at least 4 characters.');
        return;
    } else if (!/^[a-zA-Z0-9]+$/.test(username_raw)) {
        displayError('Username must be only letters and numbers.');
    }

    let raw_password = document.getElementById("password_raw").value;

    if (raw_password.length < 8) {
        displayError('Password must be at least 8 characters.');
        return;
    }

    if (group_name === 'Create New Group') {
        group_name = $('#group-name-raw')[0].value;

        if (group_name === 'Create New Group') {
            displayError('Password must be at least 8 characters.');
            return;
        }
    } else if (group_name.length < 4 ) {
        displayError('Group Name must be at least 4 characters.');
        return;
    }

    let salt = "";

    for (let i = 0; i < 16; i++) {
        salt += String.fromCharCode(randomIntFromInterval(33, 126));
    }

    let passwordHash = generatePasswordString(salt, raw_password).toString();

    // TODO: Select currently created groups

    let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();
    let data = {
        'username': username_raw,
        'passwordHash': passwordHash,
        'salt': salt,
        'group_name': group_name,
        'is_observer': is_observer,
    }

    $.ajax({
        type: "POST",
        url: "create",
        headers: {
            "XSRF-TOKEN": xsrf,
        },
        data: data,
        dataType: 'json',
        success: function (data) {
            console.log("SUCCESS : ", data);

            if (data.error) {
                displayError('Username already exists.');
                document.getElementById("password_raw").value = "";
            } else {
                window.location.replace('/users/login');
            }

        },
        error: function(data) {
            displayError('Can not create user at this time');
            console.log("error: ", data)
        },
    });
}

function displayError(message) {
    console.log("error: " + message);
    document.getElementsByClassName("errorSpot")[0].innerHTML = message;
    document.getElementsByClassName("errorSpot")[0].style.display = 'block';
    return;
}

function checkLoginCredentials(username, salt, password) {
    let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();
    let passwordHash = generatePasswordString(salt, password).toString();

    let data = {
        'username': username,
        'passwordHash': passwordHash,
    }

    // Checks the password to the username to login
    $.ajax({
        type: "POST",
        url: "login",
        headers: {
            "XSRF-TOKEN": xsrf,
        },
        data: data,
        dataType: 'json',
        success: function (res) {
            if (res.error) {
                displayError(res.error);
            } else {
                setCookie('username', res.userName, 2);
                window.location.replace('../../group');
            }

        },
        error: function (res) {
            displayError('Password is incorrect.');
        }
    });
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password_raw").value;
    let salt = '';
    let data = {
        'username': username,
        'passwordHash': '',
    }
    let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();

    // Checks to see if the username exists in the database
    $.ajax({
        type: "POST",
        url: "login",
        headers: {
            "XSRF-TOKEN": xsrf,
        },
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.error) {
                displayError(response.error);
            }
            else if (response.userName.toLowerCase() === username.toLowerCase()) {
                checkLoginCredentials(username, response.salt, password);
            } else {
                displayError('Username is not found.');
            }
        },
        error: function (response) {
            displayError('Username is not found.');
        }
    });

}

function updateComboBox(data) {

    if (document.getElementById("combobox")) {
        return;
    }

    let comboBox = d3.select('#combo').append('select').attr('id', 'combobox');

    for (let g of data) {
        comboBox.append('option')
            .attr('value', g)
            .html(g);
    }

    comboBox.append('option')
        .attr('value', 'Create New Group').attr('id', 'create-new-group')
        .html('Create New Group');

    comboBox.on('change',
        () => {
            group = d3.select('#combobox').node().value;
            if (group === 'Create New Group') {
                d3.select('#group-name-div').node().style.display = 'block';
            } else {
                d3.select('#group-name-div').node().style.display = 'none';
            }
        });
}

window.onload = function () {
    if (document.getElementById("loginButton3")) {

        //TODO: add in that they are made visible instead of the other way
        if (getCookie('username') === '') {
            document.getElementById("playGame").style.display = 'block';
            document.getElementById("loginButton3").style.display = 'block';
        } else {
            document.getElementById("loginButton1").style.display = 'block';
            document.getElementById("loginButton2").style.display = 'block';
        }
    } else {
        // Get the data for the dropdown object
        // TODO: wait for daniel to finish the endpoint for getting groups
        //$.ajax({
        //    type: "POST",
        //    url: "login",
        //    headers: {
        //        "XSRF-TOKEN": xsrf,
        //    },
        //    data: data,
        //    dataType: 'json',
        //    success: function (response) {
        //        if (response.error) {
        //            displayError(response.error);
        //        }
        //        else if (response.userName.toLowerCase() === username.toLowerCase()) {
        //            checkLoginCredentials(username, response.salt, password);
        //        } else {
        //            displayError('Username is not found.');
        //        }
        //    },
        //    error: function (response) {
        //        displayError('Username is not found.');
        //    }
        //});

        updateComboBox(['Group 1', 'Group 2', 'Group 3']);
    }
}