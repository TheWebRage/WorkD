//Gets the username for the current user
let username = getCookie('username');
let group = getCookie('group_name');
let observer = getCookie('is_observing');


////////    Format for using the pi chart with a JSON object    //////////////////////
//let data = { Bob: 27, Joe: 18, Frank: 14, Henry: 18, Paul: 70 };

////////    Function to generate the pi chart
//generatePiChart(data);

let groups = [];

//Runs when the page is fully loaded
//Fills the combobox and sets it's value to the group the user is in
window.onload = function () {
    $.ajax({
        type: 'POST',
        url: '/group?handler=Groups',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        dataType: 'json',
        success: function (response) {
            groups = response;
            //console.log('data', response)

            updateComboBox(groups);
            changeGroup();
        },
        error: function (response) {
            alert(response);
        }
    });

    //setTimeout(500, changeGroup);

    //shows the time entries at the opening of the webpage
    if (observer === 'null') {
        document.querySelector('#newEntry').style.display = 'block';
    }
    else {
        document.querySelector('#newEntry').style.display = 'none';
    }
};

//Uses an array of data to fill the combobox with the group names
function updateComboBox(data) {
    let comboBox = d3.select('#combo')
        .append('select')
        .attr('id', 'combobox');

    for (let g of data) {
        comboBox.append('option')
            .attr('value', g)
            .html(g);
    }

    let box = document.querySelector('#combobox');

    //Makes the default group the one the user is in
    for (let i = 0; i < box.options.length; i++) {
        if (box.options[i].value === group) {
            box.selectedIndex = i;
            break;
        }
    }

    //Makes the combobox run changeGroup when changed
    comboBox.on('change', changeGroup);
}

//Using the timelog as the data input
//Creates a table and then sends relevant data to generatePiChart
function updateTable(data) {
    let tempTable = document.getElementById('table');
    let tempPieChart = document.getElementById('pichart');

    //Removes the old table if it exists
    while (tempTable.firstChild) {
        tempTable.removeChild(tempTable.firstChild);
    }

    // Removes the old pi chart if it exists
    while (tempPieChart.firstChild) {
        tempPieChart.removeChild(tempPieChart.firstChild);
    }

    //A dictionary that stores an array for each user, the array contains all the rows for the user
    let userData = {};

    //Stores the user names
    let users = [];

    //Populates userData and users
    for (let u of data) {
        if (typeof (userData[u.user.userName]) === 'undefined') {
            userData[u.user.userName] = [];
            users.push(u.user.userName);
        }

        userData[u.user.userName].push(u);
    }

    //Holds the data in the correct format for the pi chart
    //The format is user: time in seconds
    let PiChartData = {};

    //Creates one table for each user
    for (let u of users) {

        //Time for the current user, to be added to the pi chart data
        let totalTime = 0;

        //Adds the user name as a title for the next table
        d3.select('#table')
            .append('h2')
            .html(u);

        let table = d3.select('#table')
            .append('table');

        let row = table.append('tr');

        //add the headers to the table

        row.append('th')
            .html('Start Time');

        row.append('th')
            .html('End Time');

        row.append('th')
            .html('Description');

        row.append('th')
            .html('Total Time');

        //adds the rows to the tables
        for (let d of userData[u]) {
            row = table.append('tr');

            row.append('td')
                .html(d.starTime);

            row.append('td')
                .html(d.endTime);

            row.append('td')
                .html(d.description);

            //////////////////////////////////////////////
            //  Calculates total times for the current row
            //////////////////////////////////////////////

            //Parses the time strings
            let starTime = d.starTime.split('T');
            let endTime = d.endTime.split('T');

            starTime = starTime[1].split(':');
            endTime = endTime[1].split(':');

            //gets the values for hours minutes and seconds
            let startHours = parseInt(starTime[0]);
            let startMinutes = parseInt(starTime[1]);
            let startSeconds = parseInt(starTime[2]);

            let endHours = parseInt(endTime[0]);
            let endMinutes = parseInt(starTime[1]);
            let endSeconds = parseInt(starTime[2]);

            //The actual subtraction
            let totalHours = endHours - startHours;
            let totalMinutes = endMinutes - startMinutes;
            let totalSeconds = endSeconds - startSeconds;

            //Fixes negative values
            if (totalSeconds < 0) {
                totalMinutes--;
                totalSeconds += 60;
            }
            if (totalMinutes < 0) {
                totalHours--;
                totalMinutes += 60;
            }
            if (totalHours < 0) {
                totalHours += 24;
            }

            let stringHours, stringMinutes;

            //Adds a 0 before the number if it's a single digit
            if (totalHours < 10) {
                stringHours = '0' + totalHours;
            }
            else {
                stringHours = totalHours.toString();
            }

            //adds a 0 before the minutes if it's a single digit
            if (totalMinutes < 10) {
                stringMinutes = '0' + totalMinutes;
            }
            else {
                stringMinutes = totalMinutes.toString();
            }

            row.append('td')
                .html(stringHours + ':' + stringMinutes);

            //Converts the total time to seconds
            totalMinutes += totalHours * 60;
            totalSeconds += totalMinutes * 60;
            totalTime += totalSeconds;
        }

        d3.select('#table')
            .append('br');

        //Adds the time to the pi chart data with the user name as the key and the time as the value
        PiChartData[u] = totalTime;
    }

    //Shows a message if there are no users
    if (typeof (data[0]) === 'undefined') {
        d3.select('#table')
            .append('h2')
            .html('There are currently no time entries for this group');
    } else {
        //creates the pi chart
        generatePiChart(PiChartData);
    }

    
}

//Activates when the combobox is changed
//Requests times from the server, then updates the tables
function changeGroup() {
    let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();

    //Sends group name to server, receives time log back
    $.ajax({
        type: 'POST',
        url: 'group?handler=TimeEntries',
        headers: {
            'XSRF-TOKEN': xsrf,
        },
        data: { groupName: document.querySelector('#combobox').value },
        dataType: 'json',
        success: function (response) {
            console.log('data', response);
            updateTable(response);
        },
        error: function (response) {
            console.log('data', response);
        }
    });

    //updateTable(data);

    //Makes the submission box visible when it needs to
    let combobox = document.querySelector('#combobox');

    if ((group === combobox.value) && (observer === 'null')) {
        document.querySelector('#newEntry').style.display = 'block';
    }
    else {
        document.querySelector('#newEntry').style.display = 'none';
    }
}

//Activates when the submit button is clicked
//Sends the data to the server
function submitTime() {
    let startTime = document.querySelector('#startTime');
    let endTime = document.querySelector('#endTime');
    let description = document.querySelector('#description');

    //Makes sure values are valid
    if (startTime.value === '') {
        alert("Please enter valid start time");
    }
    else if (endTime.value === '') {
        alert("Please enter valid end time");
    }
    else if (description.value.length < 5) {
        alert('Please enter a longer description');
    }
    //All the values were valid
    else
    {
        //the object that will be sent to the server
        let temp = {
            name: username,
            StartTime: startTime.value,
            EndTime: endTime.value,
            Description: description.value
        }

        let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();

        $.ajax({
            type: 'POST',
            url: 'group?handler=SubmitTime',
            headers: {
                'XSRF-TOKEN': xsrf,
            },
            data: temp,
            dataType: 'json',
            success: function (response) {
                console.log('data', response);
                changeGroup();
            },
            error: function (response) {
                alert('There has been an error: ' + response);
            }
        });

        startTime.value = "";
        endTime.value = "";
        description.value = "";
    }
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

d3.select('#confirmButton').on('click', submitTime);