// Global variables
var clicked = false;
var interval;
var interval2;

$('document').ready(function () {
    // Setup initial slider positions
    setupSliders();
    setupButtons();
})


function setupButtons() {
    $('#start_button').click(function () {
        console.log('Game began')
        interval = setInterval(function() {
            var $sliders = $('.slider');
            $sliders.each(function(index, element) {
                var $slider = $(element);
                console.log('Heyy');
                var old_value = parseInt($slider.slider('value'))
                if (clicked == true) {
                    var new_value = old_value;
                } else {
                    var new_value = OuIncrement(old_value, 3, 0.2, 0.5, 50);
                }
                $slider.slider("value", new_value);
            })
          }, 200);
    })

    $('#stop_button').click(function () {
        console.log('Game ended')
        clearInterval(interval);
    })
}


// Compute OU for a variable X
function OuIncrement(x, sigma, dt, theta, attractor) {
    return x + theta*(attractor-x)*dt + sigma*Math.sqrt(dt)*normalRandom();
}


function setupSliders() {
    var $sliders = $('.slider');
    
    $sliders.slider({
        orientation: 'vertical',
        animate: 'fast',
        range: "min",
        min: -100,
        max: 100,
    })

    $('.ui-slider-handle').text(0)

    $('#slider1').slider({
        create: function() {
          $('#custom-handle-1').text( $('#slider1').slider( "value" ) );
        },
        slide: function( event, ui ) {
          $('#custom-handle-1').text( ui.value );
        },
        change: function(event, ui) {
          $('#custom-handle-1').text( ui.value );
        }
    })

    $('#slider2').slider({
        create: function() {
          $('#custom-handle-2').text( $('#slider2').slider( "value" ) );
        },
        slide: function( event, ui ) {
          $('#custom-handle-2').text( ui.value );
        },
        change: function(event, ui) {
            $('#custom-handle-2').text( ui.value );
        }
    })

    $('#slider3').slider({
        create: function() {
          $('#custom-handle-3').text( $('#slider3').slider( "value" ) );
        },
        slide: function( event, ui ) {
          $('#custom-handle-3').text( ui.value );
        },
        change: function(event, ui) {
            $('#custom-handle-3').text( ui.value );
        }
    })

    $('.ui-slider-handle').mousedown(function() {
        interval2 = setInterval(function () {
            console.log('I am clicked!!!');
            clicked = true;
        }, 100)
    })
    
    $('body').mouseup(function() {
        console.log('I work');
        clearInterval(interval2);
        clicked = false;
    })
}

// Normal distribution functions
// https://gist.github.com/bluesmoon/7925696

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