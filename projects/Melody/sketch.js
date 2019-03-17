// Willie Payne
// Code of Music Homework 3
// 9/29/2018

let c_width = 600; // Window Size params
let c_height = 400;
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

// Set up multiple scales here if you want
let ryukyu = [
    "F4", "A4", "A#4", "C5", "E5",
    "F5", "A5", "A#5", "C6", "E6",
    "F6"
];

let noteNames = ryukyu.slice().reverse(); // Fix - use array duplication

// Load all the audio and set up chain
let reverb = new Tone.Freeverb(0.95, 2000);
let reverb_vol = new Tone.Volume(-12);
let master_vol = new Tone.Volume(0);
// number of files in audio folder
let all_pitches = load_all_pitches(26, reverb, reverb_vol, master_vol);

// Overall Rhythmic/Pitch Grid
let total_beats = 16;
let total_pitches = noteNames.length;
let grid;

// Particles function as living notes added to the grid
Particle.positions = generate_zeros(total_pitches, total_beats);
let particles = [];

Tone.Transport.bpm.value = 120;

let loop = new Tone.Sequence(function(time, col){
    let column = getBeatColumn(Particle.positions, col);
    for (let i = 0; i < column.length; i++) {
        grid.bump_column(col);
        if (column[i]) {
            bump_particles(col);
            let lifespan = get_particle_lifespan(col, i);
            playSound(all_pitches[noteNames[i]], time, lifespan);
        }
    }
}, [...Array(total_beats).keys()], "16n");
loop.start();

// Setup
function setup() {
  createCanvas(c_width, c_height);
  background(redd, grenn, blu);
  grid = new Grid(total_beats, total_pitches);
  grid.show();
}

// Draw
function draw() {
    setBackgroundColor();
    grid.show();
    updateParticles();
    drawText();
}

function playSound(pitch_obj, time, lifespan=0) {
    let samp = pitch_obj.player;
    // console.log(lifespan);
    if (samp.loaded) {

        // Decrease volume as particle dies
        samp.volume.value = my_map(lifespan, 0, 1, -12, 0);
        samp.start(time, 0, "4n");
    }
}

function reset() {
    Particle.positions = generate_zeros(total_pitches, total_beats);
    particles = [];
    return;
}

function addRandBeat() {
    let col_len = Particle.positions.length;
    let row_len = Particle.positions[0].length;
    let total_beats = col_len * row_len;
    let added = false;
    let rand_col;
    let rand_row;

    // Prevent infinite while loop - this fix doesn't work!!!
    // Will still break!
    let beat_count = sum2DArray(Particle.positions);
    if (beat_count >= total_beats) {
        return added;
    }

    // Keep trying until we find a place in the matrix without a beat
    while (!added) {
        // Favor lower pitches - this mapping will rarely reach the top
        rand_col = Math.floor((skewedRand(0, 1, 0.4)*col_len));
        rand_row = Math.floor(Math.random()*row_len);
        let attempt = Particle.positions[rand_col][rand_row];
        if (!attempt) {
            particles.push(new Particle(rand_row, rand_col, grid));
            added = true;
        }
    }
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

function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].active) {
            particles[i].update();
            particles[i].show();
        }
    }
}

function bump_particles(beat) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].beat == beat) {
            particles[i].bump();
        }
    }
}

function get_particle_lifespan(beat, pitch) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].beat == beat && particles[i].pitch == pitch) {
            if (particles[i].active) {
                return particles[i].get_lifespan();
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
        addRandBeat();
    }
    if (tutorial_text.length == 3) {
        tutorial_text.shift();
    }
    return false;
}

function mouseClicked() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
	
    if (mouseX < width && mouseY < height && !window_active) {
        Tone.Transport.start();
        window_active = true;
        grid.activate();
        if (tutorial_text.length == 4) {
            tutorial_text.shift();
        }
    }
    else if (mouseX > width || mouseY > height && window_active) {
        Tone.Transport.stop();
        window_active = false;
        grid.deactivate();
        reset();
        if (tutorial_text.length == 2) {
            tutorial_text.shift();
        }
    }
}

// Returns an object where:
//  key: pitch
//  Value: {pitch, pitch_class, audio_file, player, pan}
// In the future, this may include multiple audo_files and players
function load_all_pitches(num_pitches, reverb, reverb_vol, master_vol) {
    let all_pitches = {};
    for (let i = 1; i < num_pitches; i++) {
        let new_pitch = create_audio_name(i);

        new_pitch.player = new Tone.Player(new_pitch.audio_file);

        let pan_amount = my_map(i, 1, num_pitches, -0.8, 0.8)
        new_pitch.pan = new Tone.PanVol(pan_amount, -12);

        new_pitch.player.chain(new_pitch.pan, reverb, reverb_vol, master_vol, Tone.Master);
        new_pitch.player.chain(new_pitch.pan, master_vol, Tone.Master);

        all_pitches[new_pitch.pitch] = new_pitch;
    }
    return all_pitches;
}

// Function for creating urls necessary to load audio along with their pitches
// This is unique to the xylophone library I am using as it starts with
// the pitch F4 labelled A (1).wav
function create_audio_name(pitch_num) {
    let p_classes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'C#'];
    let audio_file = 'audio/A\ (' + pitch_num + ').wav';
    let p_class = p_classes[pitch_num % p_classes.length];

    // There must be a better solution to this...
    let base_octave = 4;
    if (pitch_num >= 20) { base_octave += 2; }
    else if (pitch_num >= 8) { base_octave += 1; }

    let pitch = p_class + base_octave;

    return {
        pitch: pitch,
        pitch_class:p_class,
        audio_file: audio_file
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

function generate_zeros(rows, cols) {
    let new_arr = Array(rows).fill().map(() => Array(cols).fill(0));
    return new_arr;
}

// The p5 map function must be called in setup or loop as far as I can tell
function my_map(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
