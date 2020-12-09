//Gets the username for the current user
let username = getCookie('username');
let group = getCookie('group_name');
let observer = getCookie('is_observing');

console.log(username + ' ' + group + ' ' + observer);

////////    Format for using the pi chart with a JSON object    //////////////////////
let data = { Bob: 27, Joe: 18, Frank: 14, Henry: 18, Paul: 70 };

////////    Function to generate the pi chart
//generatePiChart(data);

let groups = ['group1', 'group2', 'group3'];

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
            console.log('data', response)
            updateComboBox(groups);
        },
        error: function (response) {
            alert(response);
        }
    });
};



function updateComboBox(data) {
    let comboBox = d3.select('#combo')
        .append('select')
        .attr('id', 'combobox');

    for (let g of data) {
        comboBox.append('option')
            .attr('value', g)
            .html(g);
    }

    comboBox.on('change', changeGroup);
}

function updateTable(data) {
    let tempTable = document.getElementById('table');

    //Removes the old table if it exists
    if (typeof (tempTable) !== 'undefined' && tempTable !== null) {
        for (let o of tempTable.children) {
            o.remove();
        }
    }

    let userData = {};
    let users = [];

    for (let u of data) {
        if (typeof (userData[u.user]) === 'undefined') {
            userData[u.user] = [];
            users.push(u.user);
        }

        userData[u.user].push(u);
    }


    let PiChartData = {};

    for (let u of users) {
        let totalTime = 0;

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
            .html('Total Time');

        for (let d of userData[u]) {
            row = table.append('tr');

            row.append('td')
                .html(d.starTime);

            row.append('td')
                .html(d.endTime);

            let starTime = d.starTime.split('T');
            let endTime = d.endTime.split('T');

            starTime = starTime[1].split(':');
            endTime = endTime[1].split(':');

            let startHours = parseInt(starTime[0]);
            let startMinutes = parseInt(starTime[1]);
            let startSeconds = parseInt(starTime[2]);

            let endHours = parseInt(endTime[0]);
            let endMinutes = parseInt(starTime[1]);
            let endSeconds = parseInt(starTime[2]);

            let totalHours = endHours - startHours;
            let totalMinutes = endMinutes - startMinutes;
            let totalSeconds = endSeconds - startSeconds;

            if (totalSeconds < 0) {
                totalMinutes--;
                totalSeconds += 60;
            }
            if (totalMinutes < 0) {
                totalHours--;
                totalMinutes += 60;
            }

            let stringHours, stringMinutes;

            if (totalHours < 10) {
                stringHours = '0' + totalHours;
            }
            else {
                stringHours = totalHours.toString();
            }

            if (totalMinutes < 10) {
                stringMinutes = '0' + totalMinutes;
            }
            else {
                stringMinutes = totalMinutes.toString();
            }

            row.append('td')
                .html(stringHours + ':' + stringMinutes);

            totalMinutes += totalHours * 60;
            totalSeconds += totalMinutes * 60;
            totalTime += totalSeconds;
        }

        PiChartData[u] = totalTime;
    }

    generatePiChart(PiChartData);
}

let users = [
    {
        user: 'Bob',
        starTime: '2020-12-08T10:00:00',
        endTime: '2020-12-08T15:00:00',
        description: 'I worked'
    },
    {
        user: 'Joe',
        starTime: '2020-12-08T08:00:00',
        endTime: '2020-12-08T15:00:00',
        description: 'I worked'
    }
]

updateTable(users);

function changeGroup() {
    let xsrf = $('input:hidden[name="__RequestVerificationToken"]').val();

    $.ajax({
        type: 'POST',
        url: 'group?handler=TimeEntries',
        headers: {
            'XSRF-TOKEN': xsrf,
        },
        data: d3.select('#combobox').node().value,
        dataType: 'json',
        success: function (response) {
            console.log('data', response);
            updateTable(response);
        },
        error: function (response) {
            console.log('data', response);
        }
    });

    let combobox = document.querySelector('#combobox');

    if ((group === combobox.value) && (observer === 'null')) {
        document.querySelector('#newEntry').style.display = 'block';
    }
    else {
        document.querySelector('#newEntry').style.display = 'none';
    }
}

d3.select('#confirmButton').on('click', submitTime);

function submitTime() {
    let startTime = document.querySelector('#startTime').value;
    let endTime = document.querySelector('#endTime').value;
    let description = document.querySelector('#description').value;

    if (startTime === '') {
        alert("Please enter valid start time");
    }
    else if (endTime === '') {
        alert("Please enter valid end time");
    }
    else if (description === '') {
        alert('Please enter valid description');
    }
    else
    {
        //the object that will be sent to the server
        let temp = {
            name: username,
            StartTime: startTime,
            EndTime: endTime,
            Description: description
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
            },
            error: function (response) {
                alert('There has been an error: ' + response);
            }
         });
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