// Utilities functions

// Get uid from prolific string
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return false
}


// Check equality of two arrays containing strings, int or floats
function arraysEqual(a1, a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) == JSON.stringify(a2);
}

// Data manipulation
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// General choice function
function random_choice(array, num, replace=true, values=true) {
    // Generate list of for indices
    var indices = [...Array(array.length).keys()];

    var choices = [];
    var choices_idx = [];

    for (var k=0; k < num; k++) {
        var indices = shuffleArray(indices);
        
        if (replace == true) {
            choices.push(array[indices[0]]);
            choices_idx.push(indices[0]);
        } else {
            idx = indices.shift()
            choices.push(array[idx]);
            choices_idx.push(idx)
        }
    }

    if (values == true) {
        return choices
    } else {
        return choices_idx
    }
    
}

// Check if string is numeric
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }


// Weighted choice function
function weighted_choice(array, weights) {
    let s = weights.reduce((a, e) => a + e);
    let r = Math.random() * s;
    return array.find((e, i) => (r -= weights[i]) < 0);
}


// Remove one element from an array and return the new sliced array
function spliceNoMutate(myArray,indexToRemove) {
    return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
}


// Randomisation
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// --- Linear algebra --- 
function eye(rank) {
    var mat = new Array(rank)

    for (i=0; i<rank; i++) {
        mat[i] = new Array(rank).fill(0)
        mat[i][i] = 1
    }

    return mat
}

// --- Normal distribution and math functions --- //
function stringify(list) {
    var outString = "";
    for (i = 0; i < list.length; i++) {
        outString = outString.concat('_').concat(list[i]);
    }
    return outString;
}
// https://gist.github.com/bluesmoon/7925696

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

var spareRandom = null;

function normalRandom() {
    var val, u, v, s, mul;

    if (spareRandom !== null) {
        val = spareRandom;
        spareRandom = null;
    } else {
        do {
            u = Math.random() * 2 - 1;
            v = Math.random() * 2 - 1;

            s = u * u + v * v;
        } while (s === 0 || s >= 1);

        mul = Math.sqrt(-2 * Math.log(s) / s);

        val = u * mul;
        spareRandom = v * mul;
    }

    return val;
}

function normalRandomInRange(min, max) {
    var val;
    do {
        val = normalRandom();
    } while (val < min || val > max);

    return val;
}

function normalRandomScaled(mean, stddev) {
    var r = normalRandom();

    r = r * stddev + mean;

    //return Math.round(r);
    // returns non rounded float
    return r;
}

function lnRandomScaled(gmean, gstddev) {
    var r = normalRandom();

    r = r * Math.log(gstddev) + Math.log(gmean);

    return Math.round(Math.exp(r));
}


// OTHERS NOT RELATED TO TASK

// Test randomisation
function test_random(func, arr, num, iter) {

    distribution = Array(arr.length).fill(0);

    for (j = 0; j < iter; j++) {
        var test = func(arr, num);

        distribution[test[0]] = distribution[test[0]] + 1

    }

    return distribution
}