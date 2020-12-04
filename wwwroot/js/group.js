
////////    Format for using the pi chart with a JSON object    //////////////////////
let data = { Bob: 27, Joe: 18, Frank: 14, Henry: 18, Paul: 70 };

////////    Function to generate the pi chart
generatePiChart(data);

function updateComboBox(data) {
    let comboBox = d3.select('#combo')
        .append('select');

    for (let g of data) {
        comboBox.append('option')
            .attr('value', g)
            .html(g);
    }

    comboBox.on('change', changeGroup);
}

let groups = ['group1', 'group2', 'group3'];

updateComboBox(groups);

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
        data: d3.select(''),
        dataType: 'json',
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            alert(response);
        }
    })
}