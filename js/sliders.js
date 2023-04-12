// --- Global variables --- //

// Logic variables
var xclicked = yclicked = zclicked = false;
var interval;
var time_step = 200;
var x = 0;
var y = 0;
var z = 0;
var count_step = 0;
var display = true;

// Ou Network computation variables
var dt = time_step/1000;
var theta = 0.5;
var causes = {
    'X': [1,0,1],
    'Y': [1,1,0],
    'Z': [0,-1,1]
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
var chart2;
var xPlot = [0];
var yPlot = [0];
var zPlot = [0];
var xColour = 'rgb(51, 153, 255)';
var yColour = 'rgb(255, 102, 102)';
var zColour = 'rgb(0, 204, 102)';
var xShade = 'rgb(204, 229, 255)';
var yShade = 'rgb(255, 204, 204)';
var zShade = 'rgb(204, 255, 229)';

var presets = {
    'sin': [1, 0, 1,
        1, 1, 0,
        0, -1, 1,
        'A', 'B', 'C'
    ],
    'no_link': [1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'easy_1': [1, 0, 0,
        1, 1, 0,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'easy_2': [1, 0, 0,
        0, 1, 0,
        0, -1, 1,
        'A', 'B', 'C'
    ],
    'easy_3': [1, 0, 1,
        0, 1, 0,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'loop_1': [1, 0, 1,
        1, 1, 0,
        0, -1, 1,
        'A', 'B', 'C'
    ],
    'loop_2': [1, -1, 0,
        0, 1, -1,
        -1, 0, 1,
        'A', 'B', 'C'
    ],
    'loop_3': [1, 0, -1,
        1, 1, 0,
        0, 1, 1,
        'A', 'B', 'C'
    ],
    'pos_chain_1': [1, 0, 0,
        1, 1, 0,
        0, 1, 1,
        'A', 'B', 'C'
    ],
    'pos_chain_2': [1, -1, 0,
        0, 1, 0,
        -1, 0, 1,
        'A', 'B', 'C'
    ],
    'pos_chain_3': [1, 1, 0,
        0, 1, 1,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'dampened_1': [1, 0, 0,
        1, 1, 0,
        -0.5, 1, 1,
        'A', 'B', 'C'
    ],
    'dampened_2': [1, -1, 0,
        0, 1, 0,
        -1, -0.5, 1,
        'A', 'B', 'C'
    ],
    'dampened_3': [1, 1, 0.5,
        0, 1, -1,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'collider_1': [1, 0, 0,
        0, 1, 0,
        -1, -1, 1,
        'A', 'B', 'C'
    ],
    'collider_2': [1, -1, -1,
        0, 1, 0,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'collider_3': [1, 0, 0,
        1, 1, 1,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'ccause_1': [1, 0, 0,
        1, 1, 0,
        1, 0, 1,
        'A', 'B', 'C'
    ],
    'ccause_2': [1, 1, 0,
        0, 1, 0,
        0, 1, 1,
        'A', 'B', 'C'
    ],
    'ccause_3': [1, 0, 1,
        0, 1, 1,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'confound_1': [1, 0, 0,
        0.5, 1, -1,
        -1, 0, 1,
        'A', 'B', 'C'
    ],
    'confound_2': [1, 1, 0,
        0, 1, 0,
        1, 0.5, 1,
        'A', 'B', 'C'
    ],
    'confound_3': [1, 0, 1,
        1, 1, 0.5,
        0, 0, 1,
        'A', 'B', 'C'
    ],
    'avg_z': [1, 0, 0,
        1, 1, 0,
        1, -1, 1,
        'A', 'B', 'C'
    ],
    'convergence': [1, -1, 1,
        1, 1, -1,
        -1, 1, 1,
        'A', 'B', 'C'
    ],
    'flanck': [1, 0, 0,
        1, 1, -1,
        1, -1, 1,
        'A', 'B', 'C'
    ],
    'virus': [1, 0.8, 0.2,
        0, 1, 0,
        0.2, -0.8, 1,
        'Positive tests', 'Infected cases', 'Negative tests'
    ],
    'crime': [
        [1, -1, 0,
            1, 1, 0,
            -0.5, -0.5, 1,
            'Crime rate', 'Police action', 'Population happiness',
            'Crime<br>rate', 'Police<br>action', 'Population happiness'
        ],
        [1, 0, -1,
            -0.5, 1, -0.5,
            1, 0, 1,
            'Crime rate', 'Population happiness', 'Police action',
            'Crime<br>rate', 'Population happiness', 'Police<br>action'
        ],
        [1, 1, 0,
            -1, 1, 0,
            -0.5, -0.5, 1,
            'Police action', 'Crime rate', 'Population happiness',
            'Police<br>action', 'Crime<br>rate', 'Population happiness'
        ],
        [1, 0, 1,
            -0.5, 1, -0.5,
            -1, 0, 1,
            'Police action', 'Population happiness', 'Crime rate',
            'Police<br>action', 'Population happiness', 'Crime<br>rate'
        ],
        [1, -0.5, -0.5,
            0, 1, -1,
            0, 1, 1,
            'Population happiness', 'Crime rate', 'Police action',
            'Population happiness', 'Crime<br>rate', 'Police<br>action'
        ],
        [1, -0.5, -0.5,
            0, 1, 1,
            0, -1, 1,
            'Population happiness', 'Police action', 'Crime rate',
            'Population happiness', 'Police<br>action', 'Crime<br>rate'
        ]
    ],
    'crime_control': [
        [1, -1, 0,
            1, 1, 0,
            -0.5, -0.5, 1,
            'A', 'B', 'C'
        ],
        [1, 0, -1,
            -0.5, 1, -0.5,
            1, 0, 1,
            'A', 'B', 'C'
        ],
        [1, 1, 0,
            -1, 1, 0,
            -0.5, -0.5, 1,
            'A', 'B', 'C'
        ],
        [1, 0, 1,
            -0.5, 1, -0.5,
            -1, 0, 1,
            'A', 'B', 'C'
        ],
        [1, -0.5, -0.5,
            0, 1, -1,
            0, 1, 1,
            'A', 'B', 'C'
        ],
        [1, -0.5, -0.5,
            0, 1, 1,
            0, -1, 1,
            'A', 'B', 'C'
        ]
    ],
    'finance': [1, -0.5, -1,
        0, 1, -1,
        -0.5, 1, 1,
        'Stock Prices', 'Virus cases', 'Confinement measures'
    ],
    'finance_control': [1, -0.5, -1,
        0, 1, -1,
        -0.5, 1, 1,
        'A', 'B', 'C'
    ],
    'estate': [1, 1, 1,
        -0.5, 1, 0.5,
        -1, -1, 1,
        'House Prices', 'Population Density', 'Desirability',
        'House Prices', 'Population Density', 'Desira-<br>bility'
    ],
    'estate_control': [1, 1, 1,
        -0.5, 1, 1,
        -1, -1, 1,
        'A', 'B', 'C'
    ],
    'virus-2': [1, -0.5, -1,
        0, 1, -1,
        0.5, 1, 1,
        'Stock Prices', 'Covid-19 cases', 'Confinement measures'
    ]
}

// --- Global function run at page load --- //

$('document').ready(function () {
    // Setup initial slider positions
    setupSliders();
     // Setup chart logic and look
    setupChart(['A', 'B', 'C']);
    // Setup user interface
    setupInterface();

    updateModel('sin')

})


// --- Interface setup: Button, parameters and coefficients --- //

function setupInterface() {
    $('.condition_container').css({
        'display': 'none'
    });

    // Setup start button to disable coef interface and launch the game.
    // The values update based on the time_step variable (milliseconds)
    // Main game loop is here
    $('#start_button').click(function () {
        console.log('Game began');
        $('.coef_input').spinner( "option", "disabled", true);
        $('.condition_selector').checkboxradio( "option", "disabled", true);
        $('#preset_selector').selectmenu( "option", "disabled", true);
        interval = setInterval(function() {
            ouNetwork();
            var new_step = round(parseFloat(steps[steps.length - 1] + time_step / 1000), 2)
            record(x, y, z, xclicked, yclicked, zclicked, new_step);
            if (count_step % 10 == 0) {
                if (xclicked == true) {
                    addData(chart, new_step, [x, y, z, 100, NaN, NaN]);
                    //addShade(chart, new_step, [x, y, z, 100], [0, 1, 2, 3]);
                } else if (yclicked == true) {
                    addData(chart, new_step, [x, y, z, NaN, 100, NaN]);
                    //addShade(chart, new_step, [x, y, z, 100], [0, 1, 2, 4]);
                } else if (zclicked == true) {
                    addData(chart, new_step, [x, y, z, NaN, NaN, 100]);
                    //addShade(chart, new_step, [x, y, z, 100], [0, 1, 2, 5]);
                } else {
                    addData(chart, new_step, [x, y, z, NaN, NaN, NaN]);
                }
                // Remove data if too much is plotted here max datapoints is
                if (chart.data.datasets[0].data.length > 15/dt) {
                    removeData(chart);
                }
            }
            //console.log(x);
        }, time_step)
    })

    // Setup the stop button to stop the game and enable changes in the coef table.
    $('#stop_button').click(function () {
        console.log('Game paused');
        clearInterval(interval);
        $('.coef_input').spinner( "option", "disabled", false);
        $('.condition_selector').checkboxradio( "option", "disabled", false);
        $('#preset_selector').selectmenu( "option", "disabled", false);
    })

    // Setup the reset button to stop the game and reset values to 0.
    $('#reset_button').click(function () {
        console.log('Game reset');
        clearInterval(interval);
        $('.coef_input').spinner( "option", "disabled", false);
        $('.condition_selector').checkboxradio( "option", "disabled", false);
        $('#preset_selector').selectmenu( "option", "disabled", false);
        $('.slider').slider("value", 0);
        setupChart(['A', 'B', 'C']);
    })

    $('button').button();

    // Sets up the theta parameter spinner
    $('#theta-spinner').prop('disabled', true);
    var $spinner = $('.theta_spinner');
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

    // Setup of preset selector
    $( ".selector" ).selectmenu({
        appendTo: ".selector_container",
        select: function(event, ui) {
            console.log(ui.item.value)
            updateModel(ui.item.value);
        }
      }).selectmenu( "menuWidget" ).addClass( "overflow" );

    // Setup of condition radio
    $('input[type="radio"]').checkboxradio();

    // Setup coefficient values based on the causes dictionary
    $('.coef_input').spinner({
        min: -10, 
        max: 10,
        step: 0.1
    });
    $('.coef_input').each(function(index, element) {
        var $coef = $(element);

        var V = $coef.attr('id').slice(0, 1);
        var idx = parseFloat($coef.attr('id').slice(-1));
        $coef.spinner('value', causes[V][idx]);

        $coef.spinner({
            stop: function () {
                causes[V][idx] = parseFloat($coef.spinner('value'));
                //console.log(causes[V][idx]);
                //console.log(causes);
                console.log($coef.spinner('value'))
            }
        })
    })
}

// Updates the values of the input table with the selects preset 
function updateModel(preset) {
    var presetValues = presets[preset];
    causes['X'] = presetValues.slice(0, 3);
    causes['Y'] = presetValues.slice(3, 6);
    causes['Z'] = presetValues.slice(6, 9);
    var presetLabels = presetValues.slice(9);

    $('#x_label').html('');
    $('#y_label').html('');
    $('#z_label').html('');

    $('#custom-handle-1').html(presetLabels[0])
    $('#custom-handle-2').html(presetLabels[1])
    $('#custom-handle-3').html(presetLabels[2])


    $('#X_0').spinner('value', causes['X'][0]);
    $('#X_1').spinner('value', causes['Y'][0]);
    $('#X_2').spinner('value', causes['Z'][0]);

    $('#Y_0').spinner('value', causes['X'][1]);
    $('#Y_1').spinner('value', causes['Y'][1]);
    $('#Y_2').spinner('value', causes['Z'][1]);

    $('#Z_0').spinner('value', causes['X'][2]);
    $('#Z_1').spinner('value', causes['Y'][2]);
    $('#Z_2').spinner('value', causes['Z'][2]);

    setupChart(presetLabels)

    if (presetLabels[1] == 'B') {
        //console.log('Hello')
        $('.graph-pred-rec-right').css('visibility', 'hidden');
        $('#custom-handle-1, #custom-handle-2, #custom-handle-3').css({
            'line-height': '3em',
            'font-size': 'smaller'
        });
        
    } else {
        $('.graph-pred-rec-right').css('visibility', 'visible');
        $('#custom-handle-1, #custom-handle-2, #custom-handle-3').css({
            'line-height': '1.5em',
            'font-size': 'smaller'
        });
    }
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
    
    if (variabe_name == 'X') {
        // Compute x attractor value
        var x_att = x*(1-Math.abs(x)/100)*coefs[0];
        // Compute y attractor value
        var y_att = y*coefs[1];
        // Compute z attractor value
        var z_att = z*coefs[2];
    } else if (variabe_name == 'Y') {
        // Compute x attractor value
        var x_att = x*coefs[0];
        // Compute y attractor value
        var y_att = y*(1-Math.abs(y)/100)*coefs[1];
        // Compute z attractor value
        var z_att = z*coefs[2];
    } else {
        // Compute x attractor value
        var x_att = x*coefs[0];
        // Compute y attractor value
        var y_att = y*coefs[1];
        // Compute z attractor value
        var z_att = z*(1-Math.abs(z)/100)*coefs[2];
    }
    
    return x_att + y_att + z_att;
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
    chart.data.labels.push(round(label, 1));
    chart.data.datasets.forEach((dataset, index) => {
        //console.log(index);
        dataset.data.push(data[index]);
    });
    chart.update();
}

function addShade(chart, label, data, indices) {
    chart.data.labels.push(round(label, 0));
    for (i=0; i<indices.length; i++) {
        chart.data.datasets[indices[i]].data.push(data[i]);
    }
    chart.update();
}

function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}

function setupChart(labels) {
    var canvas_html = "<canvas id='progressPlot'></canvas>";
    $('.chart_container').html(canvas_html);
    var ctx = document.getElementById('progressPlot').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [0],
            datasets: [{
                label: labels[0],
                borderColor: xColour,
                data: [0],
                fill: false
            }, {
                label: labels[1],
                borderColor: yColour,
                data: [0],
                fill: false,
            }, {
                label: labels[2],
                borderColor: zColour,
                data: [0],
                fill: false,
            }, {
                label: '',
                data: [0],
                borderColor: xShade,
                backgroundColor: xShade,
                fill: 'start',
            }, {
                label: '',
                data: [0],
                borderColor: yShade,
                backgroundColor: yShade,
                fill: 'start',
            }, {
                label: '',
                data: [0],
                borderColor: zShade,
                backgroundColor: zShade,
                fill: 'start',
            }]
        },
        xAxisID: 'Time',
        yAxisID: 'Value',

        // Configuration options go here
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: -100, // minimum will be 0, unless there is a lower value.
                        suggestedMax: 100,
                        beginAtZero: false // minimum value will be 0.
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time (seconds)'
                    }
                }]
            }
        }
    });
}

// --- Slider initial setup --- //

function setupSliders() {

    $('#slider_X').slider({
        create: function() {
            $('#slider_X').slider("value", x);
            //console.log(x);
            //$('#custom-handle-1').text( $('#slider_X').slider( "value" ) );
        },
        slide: function( event, ui ) {
            //$('#custom-handle-1').text( ui.value );
            x = parseInt($('#slider_X').slider("value"));
        },
        change: function(event, ui) {
            //$('#custom-handle-1').text( ui.value );
            x = parseInt($('#slider_X').slider("value"));
        },
        start: function(event, ui) {
            xclicked = true
        },
        stop: function(event, ui) {
            xclicked = false
            $(':focus').blur()
        }
    })

    $('#slider_Y').slider({
        create: function() {
            $('#slider_Y').slider("value", y);
            //$('#custom-handle-2').text( $('#slider_Y').slider( "value" ) );
        },
        slide: function( event, ui ) {
            //$('#custom-handle-2').text( ui.value );
            y = parseInt($('#slider_Y').slider("value"));
        },
        change: function(event, ui) {
            //$('#custom-handle-2').text( ui.value );
            y = parseInt($('#slider_Y').slider("value"));
        },
        start: function(event, ui) {
            yclicked = true
        },
        stop: function(event, ui) {
            yclicked = false
            $(':focus').blur()
        }
    });

    $('#slider_Z').slider({
        create: function() {
            $('#slider_Z').slider("value", z);
            //$('#custom-handle-3').text( $('#slider_Z').slider( "value" ) );
        },
        slide: function( event, ui ) {
            //$('#custom-handle-3').text( ui.value );
            z = parseInt($('#slider_Z').slider("value"));
        },
        change: function(event, ui) {
            //$('#custom-handle-3').text( ui.value );
            z = parseInt($('#slider_Z').slider("value"));
        },
        start: function(event, ui) {
            zclicked = true;
        },
        stop: function(event, ui) {
            zclicked = false;
            $(':focus').blur()
        }
    });

    $('#custom-handle-1, #custom-handle-2, #custom-handle-3').css({
        'width': '6em',
        'height': '3em',
        'left': '-150%',
        'top': 'auto',
        'margin-top': '-.8em',
        'margin-left': '-1em',
        'margin-bottom': '-1.5em',
        'text-align': 'center',
        'line-height': '1.5em',
        'font-size': 'smaller'
    });

    if (display == true) {
        $('#x_label').css({
            'display': 'none',
            'color': xColour,
            'font-weight': 'bold',
            'font-size': 'large'
        });
        $('#y_label').css({
            'display': 'none',
            'color': yColour,
            'font-weight': 'bold',
            'font-size': 'large'
        });
        $('#z_label').css({
            'display': 'none',
            'color': zColour,
            'font-weight': 'bold',
            'font-size': 'large'
        });
        $('.X').css({
            'color': xColour,
            'font-weight': 'bold',
            'font-size': 'small'
        });
        $('.Y').css({
            'color': yColour,
            'font-weight': 'bold',
            'font-size': 'small'
        });
        $('.Z').css({
            'color': zColour,
            'font-weight': 'bold',
            'font-size': 'small'
        });
    }

    $('#custom-handle-1').css({
        'background-color': xColour
    })
    $('#custom-handle-2').css({
        'background-color': yColour
    })
    $('#custom-handle-3').css({
        'background-color': zColour
    })

    $('.c-blue').css('color', xColour);
    $('.c-red').css('color', yColour);
    $('.c-green').css('color', zColour);

    var $sliders = $('.slider');
    
    $sliders.slider({
        orientation: 'vertical',
        animate: 'fast',
        range: "min",
        min: -100,
        max: 100,
    })

    // Intervention setup and logic
    //$('#custom-handle-1').mousedown(function() {
    //    xclicked = true;
    //})
    //$('#custom-handle-2').mousedown(function() {
    //    yclicked = true;
    //})
    //$('#custom-handle-3').mousedown(function() {
    //    zclicked = true;
    //})

    // Clears the clicked, i.e. toggles off intervention booleans
    //$('body').mouseup(function() {
    //    //console.log('I work');
    //    xclicked = yclicked = zclicked = false;
    //})
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