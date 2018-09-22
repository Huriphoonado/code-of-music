let c_width = 400; // Window Size params
let c_height = 400;
let window_active = false;

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
let beat_names = ['kick', 'snare', 'hat', 'aux1', 'aux2'];
let beats = {
    'kick':[musical_shapes[0], musical_shapes.slice(1, 7)],
    'snare':[musical_shapes[0], musical_shapes.slice(1, 5)],
    'hat':[musical_shapes[0], musical_shapes.slice(2)],
    'aux1':[musical_shapes[0], musical_shapes.slice(0, 6)],
    'aux2':[musical_shapes[0], musical_shapes.slice(0, 6)]
};
let beat_matrix = generatePatterns();

// Audio Files

// Because we want to use panning - we can't use the Tone.js Panners object
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

// kit.chain(verb, verb_vol, master_vol, Tone.Master);
// kit.chain(master_vol, Tone.Master);

// Set up the loop
let loop = new Tone.Sequence(function(time, col){
    let column = getBeatColumn(beat_matrix, col);
    for(let i = 0; i < column.length; i++) {
        if (column[i]) {
            kit[i].start(time, 0, "8n");
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
loop.start();

function setup() {
  createCanvas(c_width, c_height);
  background(220);
  // Tone.Transport.start();
}

function draw() {
	background(220);
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

function addRandBeat() {
    let col_len = beat_matrix.length;
    let row_len = beat_matrix[0].length;
    let added = false;

    // Keep trying until we find a  place in the matrix without a beat
    while (!added) {
        let rand_col = Math.floor((Math.random()*col_len));
        let rand_row = Math.floor((Math.random()*row_len));
        let attempt = beat_matrix[rand_col][rand_row];
        if (!attempt) {
            beat_matrix[rand_col][rand_row] = 1;
            added = true;
        }
    }
}

// User Input
function keyReleased() {
    addRandBeat();
}

function mouseClicked() {
    if (mouseX < width && mouseY < height && !window_active) {
        beat_matrix = generatePatterns();
        Tone.Transport.start();
        window_active = true;
    }
    else if (mouseX > width || mouseY > height && window_active) {
        Tone.Transport.stop();
        window_active = false;
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

function skewed_random(min, max, gamma) {
	let r = Math.pow(Math.random(), 2);
}
