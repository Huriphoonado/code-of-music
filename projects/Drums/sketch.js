let c_width = 400; // Window Size params
let c_height = 400;

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
let kit = new Tone.Players({
    'kick':'audio/ECS\ Kick\ 02.wav',
    'snare':'audio/ECS\ Snare\ 10.wav',
    'hat':'audio/ECS\ HH\ 21.mp3',
    'aux1': 'audio/ECS\ Perc\ 51.wav',
    'aux2': 'audio/ECS\ Perc\ 52.wav'
});

// let freeverb = new Tone.Freeverb().toMaster();
kit.toMaster();
// kit.connect(freeverb);

let particles = [];

let loop = new Tone.Sequence(function(time, col){
    let column = getBeatColumn(beat_matrix, col);
    for(let i = 0; i < column.length; i++) {
        if (column[i]) {
            let vel = Math.random() * 0.5 + 0.5; // Not working yet
            kit.get(beat_names[i]).start(time, 0, "32n", 0, vel);
        }
    }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

Tone.Transport.start();
loop.start();

function setup() {
  createCanvas(c_width, c_height);
  background(220);
  // Tone.Transport.start();
}

//Tone.Transport.scheduleRepeat(playSounds, "16n");
// Tone.Transport.start();

function draw() {
	background(220);
}

function playSounds() {
    if (kit.loaded) {
        let beat = Tone.Transport.position.split(":")[1];
        console.log(Tone.Transport.position);
        console.log(beat);
        playBeat('kick', beat);
        playBeat('snare', beat);
        playBeat('hat', beat);
        playBeat('aux1', beat);
        playBeat('aux2', beat);
    }
}

function playBeat(ins, beat) {
    console.log(beats[ins]);
    let beat_or_rest = beats[ins][0][beat];
    if (beat_or_rest) {
        kit.get(ins).start();
    }
    return beat_or_rest;
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

// User Input
function keyReleased() {
    Tone.Transport.schedule(function(time){
        beat_matrix = generatePatterns(); // Doesn't quite do what I want
    }, Tone.Transport.nextSubdivision("1n"));
}

// Helper Functions for dealing with arrays
function rotateArray(arr, amount) {
    for (let i = 0; i < amount; i++) arr.push(arr.shift());
    return arr;
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
