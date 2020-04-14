$('document').ready(function () {
    // Setup initial slider positions
    setupChart();
})

function setupChart() {
    var ctx = document.getElementById('progressPlot').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7],
            datasets: [{
                label: 'Variable History',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
                fill: false,
            }]
        },
        xAxisID: 'Time',
        yAxisID: 'Value',

        // Configuration options go here
        options: {}
    });
}