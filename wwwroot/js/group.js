
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

}

let groups = ['group1', 'group2', 'group3'];

updateComboBox(groups);

function updateTable(data) {

}