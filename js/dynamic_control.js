// --- Global variables --- //
// Ou Network computation variables
var graph;
var attratorType = 'random-walk';
var dt = 0.2;
var timeStep = 0.2 * 1000;
var theta = 0.8;
var sigma = 3;

var selfAttractors = {
    'random-walk': function (value) {
        return 1
    },
    'zero': function (value) {
        return 0
    },
    'flexible': function (value) {
        return 1 - Math.abs(value) / 100
    },
    'borders': function (value) {
        return 1 - Math.abs(value) / 100
    },
}
// Data variables
var maxVars = 6;
var numVars = 6;
var variablesValues = [new Array(numVars).fill(0)];
var currentValues = variablesValues[0]
var variablesInterventions = [new Array(numVars).fill(0)];
var fullCausalGraph = eye(maxVars);
var causalGraph = eye(numVars);
var currentLabels = new Array(numVars).fill('');
var letterIdxMap = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5
}
var idxLetterMap = ['A', 'B', 'C', 'D', 'E', 'F']

// Logic variables
var varClicked;
var gameLoop;
// 10 steps per second with time step of 100 and dt (frequency) 1/10 : 100 * 10 = 1000 ms
var elapsed = 0; // Duration of the trial
var endTrial = 60000; // Supposed to be 1 min, time at which all stops here 1 min,  60 sec or 60,000 ms
var midTrial = endTrial * 2; //Math.floor(endTrial / 2); // Time at which participants can stop, half the total duration
var countStep = 0;
var displayLabels = 'flex' //'none';
var playing = false;
// Control Success Variables
var actionVariable = 0;
var rewardRange = [40, 80];
var targetVariable = 5;
var wasInRange = false;
var inRewardRange = false;
var rewardColor = 'rgb(14, 227, 95)';
var targetVarColour = 'rgb(116, 179, 118)'
var actionVarColour = 'rgb(199, 119, 119)';
var baseColour = 'rgb(116, 147, 179)';

// Data storage variables
var xHist = [0];
var yHist = [0];
var zHist = [0];
var xInter = [0];
var yInter = [0];
var zInter = [0];
var steps = [0];
var firstHist = ['?'];
var secondHist = ['?'];
var thirdHist = ['?'];
var fourthHist = ['?'];
var fifthHist = ['?'];
var sixthHist = ['?'];
var chart;
var chart2;
var chartHistory = 100; // Chart display duration
var plotNoInter = true;
var chartRewardList;
var chartInterList;
var aColour = 'rgb(116, 147, 179)' //'rgb(51, 153, 255)';
var bColour = 'rgb(116, 147, 179)' //'rgb(255, 102, 102)';
var cColour = 'rgb(116, 147, 179)' //'rgb(0, 204, 102)';
var dColour = 'rgb(116, 147, 179)' //'rgb(255, 126, 51)';
var eColour = 'rgb(116, 147, 179)' //'rgb(247, 151, 193)';
var fColour = 'rgb(116, 147, 179)' //'rgb(151, 247, 237)';

// Interface
var aWrapper;
var canvas;

// First initialisation loop
// Request trial parameters
window.addEventListener('DOMContentLoaded', (event) => {

    // Counter options
    $('#reward-counter-up').css({'display': 'none'})

    // Interface
    aWrapper = document.getElementById("a_wrapper");
    canvas = document.getElementById("progressPlot");

    //liveSend({'type': 'init'});
    resizeCanvas();
    setupSliders();
    setupInterface();
    graphSetUp(causalGraph, actionVariable, targetVariable);
    setRewardArea(targetVariable, rewardRange)
});

window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("resize", resizeCanvas, false);


// SERVER

// --- Set up causal graph ---

function graphSetUp(graph=null, active=0, target=5, labels=null) {
    if (graph == null) {
        numVars = 6;
        causalGraph = eye(numVars);
    } else {
        numVars = graph.length;
        causalGraph = graph;
    }
    if (labels == null) {
        currentLabels = new Array(numVars).fill('');
    } else {
        currentLabels = labels;
    }
    variablesValues = [new Array(numVars).fill(0)];
    currentValues = variablesValues[0]
    variablesInterventions = [new Array(numVars).fill(0)];
    varClicked = new Array(numVars).fill(false);
    actionVariable = active;
    targetVariable = target;

    // Set reward area
    setRewardArea(target)

    // Change slider handles
    var $sliderHandles = $('.ui-slider-handle')
    $sliderHandles.each(function (index, element) {
        var $sliderHandle = $(element)

        if ($sliderHandle.parent()[0].classList.contains('slider') == false) {
            return
        } 

        var varIdx = parseInt($sliderHandle.attr('id').slice(-1));
        if (varIdx == actionVariable) {
            $sliderHandle.css({
                'border-color': `${actionVarColour}`,
                'background-color': `${actionVarColour}`
            })
            $sliderHandle.parent().css({'pointer-events' : 'auto'})
        } else if (varIdx == targetVariable) {
            $sliderHandle.css({
                'border-color': `${targetVarColour}`,
                'background-color': `${targetVarColour}`
            })
            $sliderHandle.parent().css({'pointer-events' : 'none'})
        } else {
            $sliderHandle.css({
                'border-color': `${baseColour}`,
                'background-color': `${baseColour}`
            })
            $sliderHandle.parent().css({'pointer-events' : 'none'})
        }
    })

    // Disable unused sliders
    $('.slider').slider({
        disabled: true
    });


    var $sliders = $('.slider');
    // Disable unused sliders
    $sliders.each(function (index, element) {
        var $slider = $(element);
        var varIdx = parseInt($slider.attr('id').slice(-1));
        if (varIdx < numVars) {
            $slider.parent().css({'display':'flex'})
        } else {
            $slider.parent().css({'display':'none'})
        }
    })
}

// --- Start check --- //
function checkStart() {
    if (actionVariable == targetVariable) {
        return false
    } else if (actionVariable >= numVars) {
        return false
    } else if (targetVariable >= numVars) {
        return false
    } else {
        return true
    }
}

// --- Key up event function ---
function onKeyUp(event) {
    var key = event.key;
    if (playing == 'init') {
        if (key == ' ') {
            liveSend({
                'type': 'start'
            })
        }
        return;
    }
}

// --- Key down event function ---
function onKeyDown(event) {
    var key = event.key;
    if (key == ' ') {
        event.preventDefault();
    }
}

// --- Start game function ---
function startGame() {
    var $sliders = $('.slider');
        
    // Disable unused sliders
    $sliders.each(function (index, element) {
        var $slider = $(element);
        var varIdx = parseInt($slider.attr('id').slice(-1));
        if (varIdx < numVars) {
            $slider.slider('option', 'disabled', false)
        } else {
            $slider.slider('option', 'disabled', true)
        }
    })
    // Reset elapsed time
    elapsed = 0;
    // Start the game loop
    gameLoop = setInterval(function () {
        // Stop trial if elapsed equal trial duration and activate stop button if elapsed passes midway point.
        if (elapsed >= endTrial) {
            // Stop trial all together
            // Disable all interactable buttons
            $('.slider').slider({
                disabled: true
            });
            //$('#next_button').button({disabled: false});
            // Display feeback
            //$('.slider_box').css({'display': 'none'})
            //$('.button_container').css({'display': 'none'})
            // Feedback report
            //$(nodeList[0]).css({'display': 'flex'});
            $('.feedback-slider').slider({
                disabled: false
            });
            $('#val-button').css({
                'display': 'flex'
            });
            //$('#val-button').button({disabled: false});
            // Clear interval
            clearInterval(gameLoop);
        }

        // OuNetwork
        // Takes current values and updates them
        currentValues = ouNetworkUpdate(currentValues)
        console.log(currentValues)
        // Records for database export
        var new_step = round(parseFloat(steps[steps.length - 1] + timeStep / 1000), 2)
        //record(x, y, z, xclicked, yclicked, zclicked, new_step);
        
        if (inRewardRange == true) {
            wasInRange = true;
        } else {
            wasInRange = false;
        }
        inRewardRange = isInRewardRange(currentValues, targetVariable, rewardRange)
        console.log(wasInRange, inRewardRange, rewardRange)
        if (inRewardRange == true) {
            $('#reward-counter-up').html(parseInt($('#reward-counter-up').html()) + 1)
            $('#reward-counter-handle').html(parseInt($('#reward-counter-handle').html()) + 1)
        }
        if (wasInRange == false && inRewardRange == true) {
            // Change slider border color
            console.log('in reward range...')
            $(`#custom-handle-${targetVariable}`).css({
                'background-color': `${rewardColor}`,
                'border-color': `${rewardColor}`
            })
            $('#reward-counter-up').css({
                'color': `${rewardColor}`,
                'font-size': 'large',
                'font-weight': 'bolder'
            })
            $('#reward-counter-handle').css({
                'font-size': 'large',
                'font-weight': 'bolder'
            })
        } else if (wasInRange == true && inRewardRange == false) {
            // Reset slider border color
            console.log('out of reward range...')
            $(`#custom-handle-${targetVariable}`).css({
                'background-color': `${targetVarColour}`,
                'border-color': `${targetVarColour}`
            })
            $('#reward-counter-up').css({
                'color': 'black',
                'font-size': 'small',
                'font-weight': 'normal' 
            })
            $('#reward-counter-handle').css({
                'font-size': 'small',
                'font-weight': 'normal' 
            })
        }
        
        // Adds the duration of the time step to elapsed to keep track of time
        countStep += 1;
        elapsed += timeStep;
        //console.log(x);
    }, timeStep)
}

// --- Data recording for plot --- //
// Called in sliders.setupGameCanvas in the gameLoop interval, launched when starting a game, i.e. clicking on start button
function record(x, y, z, int_x, int_y, int_z, new_step) {
    xHist.push(x);
    yHist.push(y);
    zHist.push(z);
    xInter.push(+int_x);
    yInter.push(+int_y);
    zInter.push(+int_z);
    steps.push(new_step);
}
// --- Control Success Function --- //
// Checks if value is in range
function isInRewardRange(values, target, range) {
    if (values[target] >= range[0] && values[target] <= range[1]) {
        return true
    } else {
        return false
    }
}

// --- OU Network Computation --- //
// Ou Network value updates
// Called in sliders.setupGameCanvas in the gameLoop interval, launched when starting a game
function ouNetworkUpdate(values) {
    // Logic for the Ou Network
    var $sliders = $('.slider');
    var newValues = new Array(variablesValues[0].length);
    // Compute new value for each slider
    $sliders.each(function (index, element) {
        var $slider = $(element);
        var varIdx = parseInt($slider.attr('id').slice(-1));
        
        // Return if slider is disabled
        if ($slider.slider( 'option', 'disabled') == true) {
            newValues[varIdx] = null
            return
        }
        var oldValue = parseInt($slider.slider('value'));
        if (varClicked[varIdx] == true) {
            var newValue = oldValue;
        } else {
            var localAttractor = computeAttractor(varIdx, values, causalGraph);
            var newValue = oldValue + ouIncrement(oldValue, sigma, dt, theta, localAttractor);
        }
        if (newValue > 100) {
            newValue = 100;
        } else if (newValue < -100) {
            newValue = -100;
        }
        $slider.slider("value", newValue);
        newValues[varIdx] = newValue
    })
    return newValues
}

// Compute attractor value 
// Called in sliders.ouNetworkUpdate
function computeAttractor(varIdx, values, causes) {
    var coefs = causes[varIdx]
    var attractor = 0;
    var contrib;
    for (i=0; i<numVars; i++) {
        if (i == varIdx) {
            contrib = values[i] * coefs[i] * selfAttractors[attratorType](values[i])
        } else {
            contrib = values[i] * coefs[i]
        }
        attractor = attractor + contrib
    }
    return attractor
}

// Compute OU for a variable X
// Called in sliders.ouNetwork
function ouIncrement(prev_value, sigma, dt, theta, attractor) {
    return theta * (attractor - prev_value) * dt + sigma * Math.sqrt(dt) * normalRandom();
}

// --- Data recording for plot --- //
// Called in sliders.setupGameCanvas in the gameLoop interval, launched when starting a game, i.e. clicking on start button
function record(x, y, z, int_x, int_y, int_z, new_step) {
    xHist.push(x);
    yHist.push(y);
    zHist.push(z);
    xInter.push(+int_x);
    yInter.push(+int_y);
    zInter.push(+int_z);
    steps.push(new_step);
    firstHist.push($('#handle-XonY').html());
    secondHist.push($('#handle-XonZ').html());
    thirdHist.push($('#handle-YonX').html());
    fourthHist.push($('#handle-YonZ').html());
    fifthHist.push($('#handle-ZonX').html());
    sixthHist.push($('#handle-ZonY').html());
}

// --- Reward area --- //
function setRewardArea(variableIdx) {
    $('#reward-area').remove()
    $('#reward-counter-handle').remove()

    var rewardArea = $('<div id=reward-area class="ui-slider-range ui-corner-all ui-widget-header"></div>')
    var rewardHandle = $('<span id="reward-counter-handle" class="reward-counter" style="font-family: Arial, Helvetica, sans-serif;">0</span>')
    rewardArea.css({
        "bottom": `${parseInt((100 + rewardRange[0])/2)}%`,
        "height": `${parseInt((rewardRange[1] - rewardRange[0])/2)}%`, 
        "background-color": `${rewardColor}`
    })
    $(`#custom-handle-${variableIdx}`).after(rewardArea)
    $(`#custom-handle-${variableIdx}`).html(rewardHandle)
}

// -- Number of variables --- //

function adjustVarNumber() {
    for (i=0; i<maxVars+1; i++) {
        if (i > numVars) {
            $(`.row-${i}`).css({'display': 'none'})
            $(`.col-${i}`).css({'display': 'none'})
        } else {
            $(`.row-${i}`).css({'display': 'flex'})
            $(`.col-${i}`).css({'display': 'flex'})
        }
    }
}

// -- Effective graph --- //

function setEffectiveGraph(fullGraph, numVar) {
    var effectiveGraph = eye(numVar)

    for (i=0; i<numVar; i++) {
        for (j=0; j<numVar; j++) {
            effectiveGraph[i][j] = fullGraph[i][j]
        }
    }

    return effectiveGraph
}

// --- Window size handlers ---
function setCanvasScalingFactor() {
    return window.devicePixelRatio || 1;
}

function resizeCanvas() {
    //Gets the devicePixelRatio
    var pixelRatio = setCanvasScalingFactor();
    var width = Math.round(1 * window.innerWidth);
    //This will be used to downscale the canvas element when devicePixelRatio > 1
    aWrapper.style.width = width + "px";
    //canvas.width = Math.round(0.1 * width);
    //This is done in order to maintain the 1:1 aspect ratio, adjust as needed
    var height = Math.round(0.8 * window.innerHeight);
    aWrapper.style.height = height + "px";
    //canvas.height = Math.round(0.1 * height);
}

// --- Slider initial setup --- //
// Called in survey.document.ready() (general initialisation function)
function setupSliders() {
    $('#slider-0').slider({
        create: function () {
            $('#slider-0').slider("value", currentValues[0]);
        },
        slide: function (event, ui) {
            currentValues[0] = parseInt($('#slider-0').slider("value"));
        },
        change: function (event, ui) {
            currentValues[0] = parseInt($('#slider-0').slider("value"));
        },
        start: function (event, ui) {
            varClicked[0] = true
        },
        stop: function (event, ui) {
            varClicked[0] = false
            $(':focus').blur()
        }
    })
    $('#slider-1').slider({
        create: function () {
            $('#slider-1').slider("value", currentValues[1]);
        },
        slide: function (event, ui) {
            currentValues[1] = parseInt($('#slider-1').slider("value"));
        },
        change: function (event, ui) {
            currentValues[1] = parseInt($('#slider-1').slider("value"));
        },
        start: function (event, ui) {
            varClicked[1] = true
        },
        stop: function (event, ui) {
            varClicked[1] = false
            $(':focus').blur()
        }
    });
    $('#slider-2').slider({
        create: function () {
            $('#slider-2').slider("value", currentValues[2]);
        },
        slide: function (event, ui) {
            currentValues[2] = parseInt($('#slider-2').slider("value"));
        },
        change: function (event, ui) {
            currentValues[2] = parseInt($('#slider-2').slider("value"));
        },
        start: function (event, ui) {
            varClicked[2] = true;
        },
        stop: function (event, ui) {
            varClicked[2] = false;
            $(':focus').blur()
        }
    });
    $('#slider-3').slider({
        create: function () {
            $('#slider-3').slider("value", currentValues[3]);
        },
        slide: function (event, ui) {
            currentValues[3] = parseInt($('#slider-3').slider("value"));
        },
        change: function (event, ui) {
            currentValues[3] = parseInt($('#slider-3').slider("value"));
        },
        start: function (event, ui) {
            varClicked[3] = true;
        },
        stop: function (event, ui) {
            varClicked[3] = false;
            $(':focus').blur()
        }
    });
    $('#slider-4').slider({
        create: function () {
            $('#slider-4').slider("value", currentValues[4]);
        },
        slide: function (event, ui) {
            currentValues[4] = parseInt($('#slider-4').slider("value"));
        },
        change: function (event, ui) {
            currentValues[4] = parseInt($('#slider-4').slider("value"));
        },
        start: function (event, ui) {
            varClicked[4] = true;
        },
        stop: function (event, ui) {
            varClicked[4] = false;
            $(':focus').blur()
        }
    });
    $('#slider-5').slider({
        create: function () {
            $('#slider-5').slider("value", currentValues[5]);
        },
        slide: function (event, ui) {
            currentValues[5] = parseInt($('#slider-5').slider("value"));
        },
        change: function (event, ui) {
            currentValues[5] = parseInt($('#slider-5').slider("value"));
        },
        start: function (event, ui) {
            varClicked[5] = true;
        },
        stop: function (event, ui) {
            varClicked[5] = false;
            $(':focus').blur()
        }
    });

    $('#a_label').css({
        'display': displayLabels,
        'color': aColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    $('#b_label').css({
        'display': displayLabels,
        'color': bColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    $('#c_label').css({
        'display': displayLabels,
        'color': cColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    $('#d_label').css({
        'display': displayLabels,
        'color': dColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    $('#e_label').css({
        'display': displayLabels,
        'color': eColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    $('#f_label').css({
        'display': displayLabels,
        'color': fColour,
        'font-weight': 'bold',
        'font-size': 'large'
    });
    
    $('#custom-handle-0').css({
        'background-color': aColour,
        'border-color': aColour
    })
    $('#custom-handle-1').css({
        'background-color': bColour,
        'border-color': bColour
    })
    $('#custom-handle-2').css({
        'background-color': cColour,
        'border-color': cColour
    })
    $('#custom-handle-3').css({
        'background-color': dColour,
        'border-color': dColour
    })
    $('#custom-handle-4').css({
        'background-color': eColour,
        'border-color': eColour
    })
    $('#custom-handle-5').css({
        'background-color': fColour,
        'border-color': fColour
    })
    var $sliders = $('.slider');
    //console.log($sliders);
    $sliders.slider({
        orientation: 'vertical',
        animate: 'fast',
        range: "none",
        min: -100,
        max: 100,
    })
    $('#custom-handle-0, #custom-handle-1, #custom-handle-2, #custom-handle-3, #custom-handle-4, #custom-handle-5').css({
        'width': '3.5em',
        'height': '1.8em',
        'left': '-1.0em',
        'margin-top': '0em',
        'margin-left': '-0.3em',
        'margin-bottom': '-0.9em',
        'text-align': 'center',
        'line-height': '1.6em',
        'font-size': 'smaller',
        'border-width': 'medium',
    });
    //$('#slider-container-6').css({
    //    'display': 'none'
    //})
}

// --- Interface setup: Button, parameters and coefficients --- //

function setupInterface() {

    // Setup start button to disable coef interface and launch the game.
    // The values update based on the timeStep variable (milliseconds)
    // Main game loop is here
    $('#start_button').click(function () {
        console.log('Game began');
        $('.coef_input').spinner( "option", "disabled", true);
        $('#dt-spinner').spinner( "option", "disabled", true);
        $('#preset-selector').selectmenu( "option", "disabled", true);
        $('#num-variable-spinner').spinner( "option", "disabled", true);
        $('#action-variable-selector').selectmenu( "option", "disabled", true);
        $('#target-variable-selector').selectmenu( "option", "disabled", true);
        startGame();
    })

    // Setup the stop button to stop the game and enable changes in the coef table.
    $('#stop_button').click(function () {
        console.log('Game paused');
        clearInterval(gameLoop);

        $('.coef_input').spinner( "option", "disabled", false);
        $('#dt-spinner').spinner( "option", "disabled", false);
        $('#preset-selector').selectmenu( "option", "disabled", false);
        $('#num-variable-spinner').spinner( "option", "disabled", false);
        $('#action-variable-selector').selectmenu( "option", "disabled", false);
        $('#target-variable-selector').selectmenu( "option", "disabled", false);
        
    })

    // Setup the reset button to stop the game and reset values to 0.
    $('#reset_button').click(function () {
        console.log('Game reset');
        clearInterval(gameLoop);
        $('.coef_input').spinner( "option", "disabled", false);
        $('#dt-spinner').spinner( "option", "disabled", false);
        $('#preset-selector').selectmenu( "option", "disabled", false);
        $('#num-variable-spinner').spinner( "option", "disabled", false);
        $('#action-variable-selector').selectmenu( "option", "disabled", false);
        $('#target-variable-selector').selectmenu( "option", "disabled", false);

        $('.slider').slider("value", 0);
        $('.slider').slider('option', 'disabled', true)
    })

    $('button').button();

    // Sets up the theta parameter spinner
    //$('#theta-spinner').prop('disabled', true);
    var $thetaSpinner = $('.theta-spinner');
    $thetaSpinner.spinner({
        min: 0, 
        max: 10,
        step: 0.1,
        stop: function(event, ui) {
            if (isNumeric(`${$thetaSpinner.spinner('value')}`) == true) {
                theta = parseFloat($thetaSpinner.spinner( "value" ));
            } else {
                $thetaSpinner.spinner('value', theta);
            }   
        }
    }).width(30);
    $thetaSpinner.spinner('value', theta);

    // Sets up the sigma parameter spinner
    //$('#sigma-spinner').prop('disabled', true);
    var $sigmaSpinner = $('.sigma-spinner');
    $sigmaSpinner.spinner({
        min: 0, 
        max: 30,
        step: 0.5,
        stop: function(event, ui) {
            if (isNumeric(`${$sigmaSpinner.spinner('value')}`) == true) {
                sigma = parseFloat($sigmaSpinner.spinner( "value" ));
            } else {
                $sigmaSpinner.spinner('value', sigma);
            }   
            
            //console.log(theta);
        }
    }).width(30);
    $sigmaSpinner.spinner('value', sigma);

    // Sets up the theta parameter spinner
    $('#dt-spinner').prop('disabled', true);
    var $dtSpinner = $('.dt-spinner');
    $dtSpinner.spinner({
        min: 0, 
        max: 1,
        step: 0.1,
        stop: function(event, ui) {
            if (isNumeric(`${$dtSpinner.spinner('value')}`) == true) {
                dt = parseFloat($dtSpinner.spinner('value'));
                timeStep = dt * 1000
            } else {
                $dtSpinner.spinner('value', dt);
            }        
            //console.log(theta);
        }
    }).width(30);
    $dtSpinner.spinner('value', dt);

    // Sets up the num variable spinner
    var $numVarSpinner = $('#num-variable-spinner');
    $numVarSpinner.prop('disabled', true);
    $numVarSpinner.spinner({
        min: 1, 
        max: 6,
        step: 1,
        stop: function(event, ui) {
            numVars = parseInt($numVarSpinner.spinner( "value" ));
            //console.log(theta);
            adjustVarNumber()

            // Update causal graph
            causalGraph = setEffectiveGraph(fullCausalGraph, numVars)
            graphSetUp(causalGraph, actionVariable, targetVariable)
        }
    }).width(30);
    $numVarSpinner.spinner('value', numVars);

    // Action variable selector
    $('#action-variable-selector').selectmenu({
        select: function(event, ui) {
            console.log(ui.item.value)
            actionVariable = letterIdxMap[ui.item.value];
            graphSetUp(causalGraph, actionVariable, targetVariable)
        }
    }).selectmenu( "menuWidget" );
    $('#action-variable-selector').val(idxLetterMap[actionVariable])
    $('#action-variable-selector').selectmenu('refresh')

    // Target variable selector
    $('#target-variable-selector').selectmenu({
        select: function(event, ui) {
            console.log(ui.item.value)
            if (letterIdxMap[ui.item.value] != actionVariable) {
                targetVariable = letterIdxMap[ui.item.value];
                graphSetUp(causalGraph, actionVariable, targetVariable)
            } else {
                $('#target-variable-selector').val(idxLetterMap[targetVariable])
                $('#target-variable-selector').selectmenu('refresh')
            }
        }
    }).selectmenu( "menuWidget" );
    $('#target-variable-selector').val(idxLetterMap[targetVariable])
    $('#target-variable-selector').selectmenu('refresh')

    // Setup of preset selector
    $( ".selector" ).selectmenu({
        appendTo: ".selector_container",
        select: function(event, ui) {
            console.log(ui.item.value)
            updateModel(ui.item.value);
        }
    }).selectmenu( "menuWidget" ).addClass( "overflow" );

    // Setup of radio
    $('input[type="radio"]').checkboxradio();

    $('#radio-random-walk').on('change', function(event) {
        // Set up no attractor
        console.log('checked none')
        attratorType = 'random-walk'
    })
    $('#radio-zero').on('change', function(event) {
        // Set up attractor to 0
        console.log('checked 0')
        attratorType = 'zero'
    })
    $('#radio-flexible').on('change', function(event) {
        // Set up attractor to flexible
        console.log('checked flexible')
        attratorType = 'flexible'
    })
    $('#radio-borders').on('change', function(event) {
        // Set up attractor to borders
        console.log('checked borders')
    })
    $(`#radio-${attratorType}`).prop('checked', true).button('refresh')
    
    $('#slider-reward-range').slider({
        orientation: 'horizontal',
        range: true,
        values: rewardRange,
        animate: 'fast',
        min: -100,
        max: 100,
        create: function () {
            $('#slider-reward-range').slider("values", rewardRange);
        },
        slide: function (event, ui) {
            $('#range-low').html(ui.values[0])
            $('#range-high').html(ui.values[1])

            rewardRange = ui.values
            setRewardArea(targetVariable)
        },
        change: function (event, ui) {
            $('#range-low').html(ui.values[0])
            $('#range-high').html(ui.values[1])

            rewardRange = ui.values
            setRewardArea(targetVariable)
        },
        start: function (event, ui) {
            $('#range-low').html(ui.values[0])
            $('#range-high').html(ui.values[1])

            rewardRange = ui.values
            setRewardArea(targetVariable)
        },
        stop: function (event, ui) {
            $('#range-low').html(ui.values[0])
            $('#range-high').html(ui.values[1])

            rewardRange = ui.values
            setRewardArea(targetVariable)
            $(':focus').blur()
        }
    })

    $('#range-low').html(rewardRange[0])
    $('#range-high').html(rewardRange[1])


    
    // Setup coefficient values based on the causes dictionary
    $('.coef_input').spinner({
        min: -10, 
        max: 10,
        step: 0.1
    });
    $('.coef_input').each(function(index, element) {
        var $coef = $(element);

        var causeIdx = parseInt($coef.attr('id').slice(0, 1));
        var effectIdx = parseInt($coef.attr('id').slice(-1));
        $coef.spinner('value', fullCausalGraph[causeIdx][effectIdx]);

        $coef.spinner({
            stop: function () {
                if (isNumeric(`${$coef.spinner('value')}`) == true) {
                    fullCausalGraph[causeIdx][effectIdx] = parseFloat($coef.spinner('value'));
                    console.log($coef.spinner('value'))

                    // Update causal graph
                    causalGraph = setEffectiveGraph(fullCausalGraph, numVars)
                    graphSetUp(causalGraph, actionVariable, targetVariable)
                    
                } else {
                    $coef.spinner('value', fullCausalGraph[causeIdx][effectIdx]);
                }
            }
        })
    })
}