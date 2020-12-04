
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
            console.log('response: ' + response[0]);
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
        totalTime: '8'
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
            alert(response);
        }
    });
}