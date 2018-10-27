// Willie Payne
// Code of Music Midterm

Tone.Transport.bpm.value = 110; // Global tempo
let loop; // Global music loop

let c_width = 800; // Window Size params
let c_height = 500;

// Various background colors used for the different modes
let bcg_col = {
    true: [
        {r: 80, g: 20, b: 80},
        {r: 20, g: 80, b: 60},
        {r: 170, g: 140, b: 10},
        {r: 22, g: 45, b: 80}
    ],
    false: [
        {r: 30, g: 30, b: 30},
        {r: 30, g: 30, b: 30},
        {r: 30, g: 30, b: 30},
        {r: 30, g: 30, b: 30}
    ],
    curr: {r: 30, g: 30, b: 30}
}

let window_active = false; // Whether the user has clicked the window
let tutorial_text = [
    'click me.',
    'press space.',
    ''
];

// Set up multiple scales as well as the variables that dictate swapping
// between them
let scale_mode = 0;

let ryukyu = [
    "F4", "A4", "A#4", "C5", "E5",
    "F5", "A5", "A#5", "C6", "E6",
    "F6"
];

let e_min_pent = [
    "E5", "G5", "A5", "B5", "D6",
    "E6", "G6", "A6", "B6", "D7",
    "E7"
];

let g_maj_pent = [
    "G4", "A4", "B4", "D5", "E5",
    "G5", "A5", "B5", "D6", "E6",
    "G6"
];

let indian_pent = [
    "D5", "F#5", "G5", "A5", "C6",
    "D6", "F#6", "G6", "A6", "C7",
    "D7"
];

let scales = [
    ryukyu.slice().reverse(),
    indian_pent.slice().reverse(),
    e_min_pent.slice().reverse(),
    g_maj_pent.slice().reverse()
];
let num_scales = scales.length;
let pitches_until_next_change = 20;

// Load all the audio and set up chain
let reverb = new Tone.Freeverb(0.95, 2000);
let reverb_vol = new Tone.Volume(-12);
let master_vol = new Tone.Volume(0);

// Number of pitches in the audio folder
let all_pitches = load_all_pitches(45, reverb, reverb_vol, master_vol);

// Overall Rhythmic/Pitch Grid
let total_beats = 16;
let total_pitches = scales[scale_mode].length;
let grid;

// Particles function as living notes added to the grid
Particle.positions = generate_zeros(total_pitches, total_beats);
let particles = [];

// Setup
function setup() {
  createCanvas(c_width, c_height);
  set_background();
  grid = new Grid(total_beats, total_pitches);
  grid.show();

  loop = new Tone.Sequence(function(time, col){
      let column = getBeatColumn(Particle.positions, col);
      for (let i = 0; i < column.length; i++) {
          grid.bump_column(col);
          if (column[i]) {
              bump_particles(col);
              let lifespan = get_particle_lifespan(col, i);
              let humanize = randomGaussian(0, 0.2)/100;

              // A lot goes into here:
              // The note for the current scale we are using
              // Time to play the note with a little "human" `random`ness
              // The note's lifespan which controls how loud it is
              playSound(all_pitches[scales[scale_mode][i]], time+humanize, lifespan);
          }
      }
  }, [...Array(total_beats).keys()], "16n");
  loop.start();
}

// Draw
function draw() {
    set_background();
    grid.show();
    updateParticles();
    drawText();
}

// Pick a random sample (as there are multiple for each pitch)
// Then check if it is loaded and hopefully play
function playSound(pitch_obj, time, lifespan=0) {
    let samp = pitch_obj.players;
    let samp_sel = ['A', 'B', 'C', 'D', 'E'][pitch_obj.current_player];

    if (samp.loaded) {
        // Decrease volume as particle dies
        samp.volume.value = my_map(lifespan, 0, 1, -14, 0.0);
        samp.get(samp_sel).start(time, 0);
        pitch_obj.current_player = (pitch_obj.current_player + 1) % 5;
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

function set_background() {
    let lerper = 0.05;
    bcg_col.curr.r = lerp(bcg_col.curr.r, bcg_col[window_active][scale_mode].r, lerper);
    bcg_col.curr.g = lerp(bcg_col.curr.g, bcg_col[window_active][scale_mode].g, lerper);
    bcg_col.curr.b = lerp(bcg_col.curr.b, bcg_col[window_active][scale_mode].b, lerper);
    background(bcg_col.curr.r, bcg_col.curr.g, bcg_col.curr.b);
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
// Function will do up to three things
//  Add a new note to the grid
//  Removes tutorial tex if it is still on the screen
// Changes the scale mode if a certain number of pitches have been added
function keyReleased() {
    if (window_active) {
        addRandBeat();
    }

    if (tutorial_text.length == 2) {
        tutorial_text.shift();
    }

    if (((particles.length + 1) % pitches_until_next_change) == 0 ) {
        change_scale_mode();
    }

    return false;
}

function mouseClicked() {
    if (mouseX < width && mouseY < height) {
        if (!window_active) {
            Tone.Transport.start();
            window_active = true;
            grid.activate(scale_mode);
            if (tutorial_text.length == 3) {
                tutorial_text.shift();
            }
        }
        else {
            Tone.Transport.stop();
            window_active = false;
            grid.deactivate();
            reset();
        }
    }
}

function change_scale_mode() {
    scale_mode = (scale_mode + 1) % num_scales;
    grid.changeMode(scale_mode);

    let random_tempo_change = floor(random(5));
    if (!random_tempo_change) {
        Tone.Transport.bpm.rampTo(floor(random(100, 125)));
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

        new_pitch.players = new Tone.Players(new_pitch.audio_files);
        new_pitch.players.fadeOut = 0.0;
        new_pitch.players.fadeIn = 0.01;
        new_pitch.current_player = Math.floor(Math.random(5));

        let pan_amount = my_map(i, 1, num_pitches, -0.8, 0.8)
        new_pitch.pan = new Tone.PanVol(pan_amount, -12);

        new_pitch.players.chain(new_pitch.pan, reverb, reverb_vol, master_vol, Tone.Master);
        new_pitch.players.chain(new_pitch.pan, master_vol, Tone.Master);

        all_pitches[new_pitch.pitch] = new_pitch;
    }
    return all_pitches;
}

// Function for creating urls necessary to load audio along with their pitches
// This is unique to the xylophone library I am using as it starts with
// the pitch F4 labelled A (1).wav
function create_audio_name(pitch_num) {
    let p_classes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'C#'];
    let p_letters = ['A', 'B', 'C', 'D', 'E'];
    let audio_files = {};

    p_letters.forEach(function(l) {
        audio_files[l] = `audio/${l}\ (${pitch_num}).wav`
    });

    let p_class = p_classes[pitch_num % p_classes.length];

    // Then calculate the octave number
    // There must be a better solution to this...
    let base_octave = 4;
    if (pitch_num >= 44) { base_octave += 4; }
    else if (pitch_num >= 32) { base_octave += 3; }
    else if (pitch_num >= 20) { base_octave += 2; }
    else if (pitch_num >= 8) { base_octave += 1; }

    let pitch = p_class + base_octave;

    return {
        pitch: pitch,
        pitch_class: p_class,
        audio_files: audio_files
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
