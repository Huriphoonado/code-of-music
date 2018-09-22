let c_width = 600; // Window Size params
let c_height = 300;
let redd = 30; // Background Colors
let grenn = 30;
let blu = 30;
let window_active = false;
let tutorial_text = [
    'click me.',
    'press space.',
    'click outside of me.',
    ''
];

Tone.Transport.bpm.value = 120;

// Musical Shape Arrays
let none = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let point = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let line = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
let tri = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
let sqre = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
let pent = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0];
let hex = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
let oct = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
// These should never be altered - make sure copy is always used
let musical_shapes = [none, point, line, tri, sqre, pent, hex, oct];

// Generate an initial set of beats
// Instruments only have acess to some of the shapes
let beats = {
    'kick':[musical_shapes[0], musical_shapes.slice(1, 7)],
    'snare':[musical_shapes[0], musical_shapes.slice(1, 5)],
    'hat':[musical_shapes[0], musical_shapes.slice(2)],
    'aux1':[musical_shapes[0], musical_shapes.slice(0, 6)],
    'aux2':[musical_shapes[0], musical_shapes.slice(0, 6)]
};
// In the future this really could be a 3d matrix of beats and particles
// Now there are two separate matrices of the same shape
let beat_matrix = generatePatterns();
let particles;

// Audio Files

// Because we want to use panning - we can't use the Tone.js Players object
let kick = new Tone.Player('audio/ECS\ Kick\ 02.wav');
let snare = new Tone.Player('audio/ECS\ Snare\ 10.wav');
let hat = new Tone.Player('audio/ECS\ HH\ 21.mp3');
let aux1 = new Tone.Player('audio/ECS\ Perc\ 51.wav');
let aux2 = new Tone.Player('audio/ECS\ Perc\ 52.wav');

let kick_pan = new Tone.PanVol(0, 0);
let snare_pan = new Tone.PanVol(-0.3, -12);
let hat_pan = new Tone.PanVol(0.3, 0);
let aux1_pan = new Tone.PanVol(-0.8, 0);
let aux2_pan = new Tone.PanVol(0.8, 0);

kit = [kick, snare, hat, aux1, aux2];
kit_pan = [kick_pan, snare_pan, hat_pan, aux1_pan, aux2_pan];

// Signal Routing
let verb = new Tone.Freeverb();
let verb_vol = new Tone.Volume(-20);
let master_vol = new Tone.Volume(0);

for (let i = 0; i < kit.length; i++) {
    kit[i].chain(kit_pan[i], verb, verb_vol, master_vol, Tone.Master);
    kit[i].chain(kit_pan[i], master_vol, Tone.Master);
}

// Set up the loop
let loop = new Tone.Sequence(function(time, col){
    let column = getBeatColumn(beat_matrix, col);
    for(let i = 0; i < column.length; i++) {
        if (column[i]) {
            playSound(kit[i], time);
            particles[i][col].bump();
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
loop.start();

function setup() {
  createCanvas(c_width, c_height);
  background(redd, grenn, blu);
  particles = generateParticles();
  drawText();
}

function draw() {
    setBackgroundColor();
    updateParticles();
    drawText();
}

function playSound(samp, time) {
    if (samp.loaded) {
        samp.volume.value = random(-2, 0); // Slight volume variation
        samp.start(time, 0, "8n");
    }
}

function generatePatterns() {
    let new_matrix = []
    for (let k in beats) {
        let randRotate = Math.floor((Math.random()*beats[k][0].length));
        let newBeat = rotateArray(getRandElem(beats[k][1]), randRotate);
        beats[k][0] = newBeat;
        new_matrix.push(newBeat);
    }
    return new_matrix;
}

// Takes a beat_matrix and converts beats to particles returning a new list
function generateParticles() {
    let new_particles = beat_matrix.slice(0);
    for (let i = 0; i < new_particles.length; i++) {
        for (let j = 0; j < new_particles[i].length; j++) {
            if (new_particles[i][j]) {
                new_particles[i][j] = new Particle(skewedRand(0, c_width),
                                                   skewedRand(0, c_height));
            }
        }
    }
    return new_particles;
}

function addRandBeat() {
    let col_len = beat_matrix.length;
    let row_len = beat_matrix[0].length;
    let total_beats = col_len * row_len;
    let added = false;
    let rand_col;
    let rand_row;

    // Prevent infinite while loop - this fix doesn't work!!!
    // Will still break
    let beat_count = sum2DArray(beat_matrix);
    if (beat_count >= total_beats) {
        return false;
    }

    // Keep trying until we find a place in the matrix without a beat
    while (!added) {
        rand_col = Math.floor((Math.random()*col_len));
        rand_row = Math.floor((Math.random()*row_len));
        let attempt = beat_matrix[rand_col][rand_row];
        if (!attempt) {
            beat_matrix[rand_col][rand_row] = 1;
            added = true;
        }
    }
    return [rand_col, rand_row];
}

function addParticle(i, j) {
    particles[i][j] = new Particle(skewedRand(0, c_width),
                                   skewedRand(0, c_height));
    return true;
}

function setBackgroundColor() {
    if (window_active) {
        redd = lerp(redd, 22, 0.05);
        grenn = lerp(grenn, 45, 0.05);
        blu = lerp(blu, 80, 0.05);
    }
    else {
        redd = lerp(redd, 10, 0.05);
        grenn = lerp(grenn, 10, 0.05);
        blu = lerp(blu, 10, 0.05);
    }
    background(redd, grenn, blu);
}

// So much embedded code!!! :(
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = 0; j < particles[i].length; j++) {
            if (particles[i][j] != 0) {
                if (window_active) {
                    particles[i][j].update();
                }
                particles[i][j].show();
            }
        }
 	}
}

function drawText() {
    fill(250);
    textSize(40);
    text(tutorial_text[0], width*0.1, height*0.2);
}

// User Input
function keyReleased() {
    if (window_active) {
        let arr_pos = addRandBeat();
        addParticle(arr_pos[0], arr_pos[1]);
    }
    if (tutorial_text.length == 3) {
        tutorial_text.shift();
    }
    return false;
}

function mouseClicked() {
    if (mouseX < width && mouseY < height && !window_active) {
        beat_matrix = generatePatterns();
        particles = generateParticles();
        Tone.Transport.start();
        window_active = true;
        if (tutorial_text.length == 4) {
            tutorial_text.shift();
        }
    }
    else if (mouseX > width || mouseY > height && window_active) {
        Tone.Transport.stop();
        window_active = false;
        if (tutorial_text.length == 2) {
            tutorial_text.shift();
        }
    }
}

// Helper Functions for dealing with arrays
function rotateArray(arr, amount) {
    let copy = arr.slice(0); // syntax for cloning arrays
    for (let i = 0; i < amount; i++) copy.push(copy.shift());
    return copy;
}

function getRandElem(arr) {
    return arr[Math.floor((Math.random()*arr.length))];
}

// Returns a column in a 2d Javascript array
function getBeatColumn(arr, col) {
    return arr.map(function(row) {
        return row[col];
    });
}

function skewedRand(min, max, gamma=0.5) {
	let r = Math.pow(Math.random(), gamma);
    return map(r, 0, 1, min, max);
}

function sum2DArray(arr) {
    let summ = arr.reduce(function(a,b) { return a.concat(b) }) // flatten
                    .reduce(function(a,b) { return a + b }); // sum
    return summ;
}
