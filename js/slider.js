// --- Global variables --- //

// Logic variables
var xclicked = yclicked = zclicked = false;
var interval;
var time_step = 200;
var x = 0;
var y = 0;
var z = 0;
var count_step = 0;

// Ou Network computation variables
var dt = time_step/1000;
var theta = 0.5;
var causes = {
    'X': [0,0,0],
    'Y': [1,0,0],
    'Z': [0,-1,0]
}

// Data storage variables
var xHist = [0];
var yHist = [0];
var zHist = [0];
var xInter = [0];
var yInter = [0];
var zInter = [0];
var steps = [0];

var chart;
var xPlot = [0];
var yPlot = [0];
var zPlot = [0];


// --- Global function run at page load --- //

$('document').ready(function () {
    // Setup initial slider positions
    setupSliders();
     // Setup chart logic and look
    setupChart();
    // Setup user interface
    setupInterface();
})


// --- Interface setup: Button, parameters and coefficients --- //

function setupInterface() {

    // Setup start button to disable coef interface and launch the game.
    // The values update based on the time_step variable (milliseconds)
    // Main game loop is here
    $('#start_button').click(function () {
        console.log('Game began');
        $('.coef_input').prop("disabled", true);
        interval = setInterval(function() {
            ouNetwork();
            var new_step = round(parseFloat(steps[steps.length - 1] + time_step / 1000), 2)
            record(x, y, z, xclicked, yclicked, zclicked, new_step);
            if (count_step % 20 == 0) {
                addData(chart, new_step, [x, y, z]);
            }
            //console.log(x);
        }, time_step)
    })

    // Setup the stop button to stop the game and enable changes in the coef table.
    $('#stop_button').click(function () {
        console.log('Game paused');
        clearInterval(interval);
        $('.coef_input').prop("disabled", false);
    })

    // Setup the reset button to stop the game and reset values to 0.
    $('#reset_button').click(function () {
        console.log('Game reset');
        clearInterval(interval);
        $('.coef_input').prop("disabled", false);
        $('.slider').slider("value", 0);
    })

    // Sets up the theta parameter spinner
    $('#theta-spinner').prop('disabled', true);
    var $spinner = $('.selector');
    $spinner.spinner({
        min: 0, 
        max: 10,
        step: 0.1,
        stop: function(event, ui) {
            theta = parseFloat($spinner.spinner( "value" ));
            //console.log(theta);
        }
    }).width(30);
    $spinner.spinner('value', theta);

    // Setup coefficient values based on the causes dictionary
    $('.coef_input').each(function(index, element) {
        var $coef = $(element);

        var V = $coef.attr('id').slice(0, 1);
        var idx = parseInt($coef.attr('id').slice(-1));

        $coef.val(causes[V][idx]);

        $coef.change(function () {
            causes[V][idx] = parseInt($coef.val());
            //console.log(causes[V][idx]);
            //console.log(causes);
        })
    })
}


// --- OU Network Computation --- //

// Ou Network value updates
function ouNetwork() {
    // Logic for the Ou Network
    var $sliders = $('.slider');

    // Compute new value for each slider
    $sliders.each(function(index, element) {
        var $slider = $(element);
        
        var var_name = $slider.attr('id').slice(-1);
        //console.log(var_name);

        var old_value = parseInt($slider.slider('value'));
        
        if ((var_name=='X' && xclicked==true) || (var_name=='Y' && yclicked==true) || (var_name=='Z' && zclicked==true)) {
            var new_value = old_value;
        } else {
            mean_attractor = attractor(var_name, causes);
            var new_value = ouIncrement(old_value, 3, dt, theta, mean_attractor);
        }
        if (new_value > 100) {
            new_value = 100;
        } else if (new_value < -100) {
            new_value = -100;
        }
        $slider.slider("value", new_value);
        //console.log(x, y, z);
    })
}

// Compute attractor value 
function attractor(variabe_name, causes) {
    var coefs = causes[variabe_name];
    //console.log(coefs);
    return x*coefs[0] + y*coefs[1] + z*coefs[2];
}

// Compute OU for a variable X
function ouIncrement(prev_value, sigma, dt, theta, attractor) {
    return prev_value + theta*(attractor-prev_value)*dt + sigma*Math.sqrt(dt)*normalRandom();
}


// --- Data recording for plot --- //

function record(x, y, z, int_x, int_y, int_z, new_step) {
    xHist.push(x);
    yHist.push(y);
    zHist.push(z);

    xInter.push(+ int_x);
    yInter.push(+ int_y);
    zInter.push(+ int_z);

    steps.push(new_step);
}


// --- Canvas and Plot Code --- //
function addData(chart, label, data) {
    chart.data.labels.push(label);
    var index = 0;
    chart.data.datasets.forEach((dataset) => {
        console.log(index);
        dataset.data.push(data[index]);
        index ++;
    });
    chart.update();
}

function setupChart() {
    var ctx = document.getElementById('progressPlot').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [0],
            datasets: [{
                label: 'X',
                borderColor: 'rgb(255, 99, 132)',
                data: [0],
                fill: false,
            }, {
                label: 'Y',
                borderColor: 'rgb(100, 149, 237)',
                data: [0],
                fill: false, 
            }, {
                label: 'Z',
                borderColor: 'rgb(23, 164, 23)',
                data: [0],
                fill: false,
            }]
        },
        xAxisID: 'Time',
        yAxisID: 'Value',

        // Configuration options go here
        options: {}
    });
}

// --- Slider initial setup --- //

function setupSliders() {

    $('#slider_X').slider({
        create: function() {
            $('#slider_X').slider("value", x);
            console.log(x);
            $('#custom-handle-1').text( $('#slider_X').slider( "value" ) );
        },
        slide: function( event, ui ) {
            $('#custom-handle-1').text( ui.value );
            x = parseInt($('#slider_X').slider("value"));
        },
        change: function(event, ui) {
            $('#custom-handle-1').text( ui.value );
            x = parseInt($('#slider_X').slider("value"));
        }
    })

    $('#slider_Y').slider({
        create: function() {
            $('#slider_Y').slider("value", y);
            $('#custom-handle-2').text( $('#slider_Y').slider( "value" ) );
        },
        slide: function( event, ui ) {
            $('#custom-handle-2').text( ui.value );
            y = parseInt($('#slider_Y').slider("value"));
        },
        change: function(event, ui) {
            $('#custom-handle-2').text( ui.value );
            y = parseInt($('#slider_Y').slider("value"));
        }
    })

    $('#slider_Z').slider({
        create: function() {
            $('#slider_Z').slider("value", z);
            $('#custom-handle-3').text( $('#slider_Z').slider( "value" ) );
        },
        slide: function( event, ui ) {
            $('#custom-handle-3').text( ui.value );
            z = parseInt($('#slider_Z').slider("value"));
        },
        change: function(event, ui) {
            $('#custom-handle-3').text( ui.value );
            z = parseInt($('#slider_Z').slider("value"));
        }
    })

    var $sliders = $('.slider');
    
    $sliders.slider({
        orientation: 'vertical',
        animate: 'fast',
        range: "min",
        min: -100,
        max: 100,
    })

    // Intervention setup and logic
    $('#custom-handle-1').mousedown(function() {
        xclicked = true;
    })
    $('#custom-handle-2').mousedown(function() {
        yclicked = true;
    })
    $('#custom-handle-3').mousedown(function() {
        zclicked = true;
    })

    // Clears the clicked, i.e. toggles off intervention booleans
    $('body').mouseup(function() {
        //console.log('I work');
        xclicked = yclicked = zclicked = false;
    })
}


// --- Normal distribution and math functions --- //
// https://gist.github.com/bluesmoon/7925696

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var spareRandom = null;

function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomInRange(min, max)
{
	var val;
	do
	{
		val = normalRandom();
	} while(val < min || val > max);
	
	return val;
}

function normalRandomScaled(mean, stddev)
{
	var r = normalRandom();

	r = r * stddev + mean;

    //return Math.round(r);
    // returns non rounded float
    return r;
}

function lnRandomScaled(gmean, gstddev)
{
	var r = normalRandom();

	r = r * Math.log(gstddev) + Math.log(gmean);

	return Math.round(Math.exp(r));
}