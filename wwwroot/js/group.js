//Gets the username for the current user
let username = getCookie('username');

////////    Format for using the pi chart with a JSON object    //////////////////////
let data = { Bob: 27, Joe: 18, Frank: 14, Henry: 18, Paul: 70 };

////////    Function to generate the pi chart
generatePiChart(data);

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

    let table = d3.select('#table')
        .append('table');

    let row = table.append('tr');

    //add the headers to the table
    row.append('th')
        .html('Student');

    row.append('th')
        .html('Start Time');

    row.append('th')
        .html('End Time');

    row.append('th')
        .html('Total Time');

    for (let u of data) {
        row = table.append('tr');

        row.append('td')
            .html(u.name);

        row.append('td')
            .html(u.startTime);

        row.append('td')
            .html(u.endTime);

        row.append('td')
            .html(u.totalTime);
    }
}

let users = [
    {
        name: 'Bob',
        startTime: '8:30',
        endTime: '4:30',
        totalTime: '8',
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
            for (let o of response) {
                console.log(o.key + ':');
                console.log(o.value + ' ');
            }
        },
        error: function (response) {
            console.log('data', response);
        }
    });
}

function submitTime() {

    let startTime = document.querySelector('#startTime').value;
    let endTime = document.querySelector('#endTime').value;
    let description = document.querySelector('#description').value;

    if (startTime === null) {
        alert("Please enter valid start time");
    }
    else if (endTime === null) {
        alert("Please enter valid end time");
    }
    else if (description === null) {
        alert('Please enter valid description');
    }
    else
    {

        let temp = {
            name: username,
            StartTime: startTime,
            EndTime: endTime,
            Description: description
        }

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