$('document').ready(function () {
    // Setup initial slider positions
    setupSliders();
    setupButtons();
})

var interval;
function setupButtons() {
    $('#start_button').click(function () {
        interval = setInterval(function() {
            console.log('Game began')
            var $sliders = $('.slider');
            
            $sliders.each(function(index, element) {
                var $slider = $(element);
                var new_value = parseInt($slider.val()) + 4;
                console.log(new_value);
                $slider.val(new_value);
                $slider.trigger('change');
            })
          }, 3000);
    })

    $('#stop_button').click(function () {
        console.log('Game ended')
        clearInterval(interval);
    })
}

// Initially set up the sliders
function setupSliders() {
    var $sliders = $('.slider');

    $sliders.each(function(index, element) {
        var $slider = $(element);
        // Place value at correct positions
        valPos('#' + $slider.attr('id'));

        // Add event listener
        $slider.change(function() {
            valPos('#' + $slider.attr('id'));
        })
        //Rotate the slider appropriately
        var sliderRect = $slider[0].getBoundingClientRect();
        //$slider.css({
        //    transform: 'rotate(270deg)',
        //})
    })
}


// Function that finds the new coordinate of the slider value field
function findThumb(sliderId) {
    var slider = $(sliderId)[0];
    //var sliderRange = parseInt(Math.abs(slider.min)) + parseInt(slider.max);
    var sliderRange = Math.abs(slider.min) + parseFloat(slider.max);

    if (slider.value > 0) {
        var sliderValue = parseFloat(slider.max) + parseFloat(slider.value);
    } else {
        var sliderValue = 100 - Math.abs(slider.value);
    }

    //console.log(sliderRange);
    //console.log(sliderValue);

    var sliderPos = sliderValue / sliderRange;
    var sliderRect = slider.getBoundingClientRect();

    // Calculate new position values
    var widthPos = sliderRect.x + (slider.clientWidth * sliderPos);
    var heightPos = sliderRect.y + sliderRect.height / 5;

    // Adjust for UI
    if (slider.value < 0) {
        widthPos = widthPos + (1 - 0.15 * sliderValue);
    } else if (slider.value == 100) {
        widthPos = widthPos + (1 - 0.17 * sliderValue);
    } else {
        widthPos = widthPos + (3 - 0.15 * sliderValue);
    }

    //console.log(sliderRect);
    //console.log(widthPos);

    return [widthPos, heightPos];
}


// Adjust Slider value position
function valPos(sliderId) {
    var $sliderV = $(sliderId + '_v');
    var pos = findThumb(sliderId);
    var widthPos = pos[0];
    var heightPos = pos[1];

    $sliderV.html($(sliderId).val());
    $sliderV.css({
        'left': widthPos + 'px',
        'top': heightPos + 'px'
    })
}


// Compute OU for a variable X
function OuProcess(x) {
    return x;
}