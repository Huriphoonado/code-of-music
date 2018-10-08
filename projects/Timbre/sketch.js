// Willie Payne
// Debussy Timbre Thingy

const c_width = 600; // Window Size params
const c_height = 400;

let bcg_col = {
    true: {r: 220, g: 220, b: 220},
    false: {r: 40, g: 40, b: 40},
    curr: {r: 220,g: 220,b: 220}
}

let active = false;

// When the mouse goes below this height, it acts as a button
// In this case, it resets heights of the blocks
const trigger_height = c_height/10;

let blocks;
let oscillators;

let num_oscillators = 7;

let tremolo = new Tone.Tremolo(7, 0.95).start();
tremolo.type = 'triangle';
tremolo.spread = 100;
let reverb = new Tone.JCReverb(0.1);
let reverb_vol = new Tone.Volume(-8);
let master_vol = new Tone.Volume(0);

// Debussy Chords
let c0 = ['A2', 'D#3', 'A3', 'C#4', 'F#4', 'C#5', 'F#5'];
let c1 = ['G#2', 'F#3', 'C#4', 'E4', 'A4', 'E5', 'A5'];
let c2 = ['B2', 'A3', 'D#4', 'F#4', 'B4', 'F#5', 'B5'];
let c3 = ['G#2', 'E3', 'G#3', 'B3', 'E4', 'B4', 'E5'];
let c4 = ['G#2', 'G#3', 'B3', 'D#4', 'G4', 'D#5', 'G5'];
let c5 = ['A2', 'D#3', 'A3', 'C#4', 'G#4', 'C#5', 'G#5'];
let line_one = [c0, c1, c2, c3, c4, c5];
let score = [];

function setup() {
    createCanvas(c_width, c_height);
    set_background();
    oscillators = build_oscillators(num_oscillators, tremolo, reverb, reverb_vol, master_vol);
    blocks = new Blocks(60, trigger_height);
    cursor = new Cursor();
}

function draw() {
    set_background();

    cursor.update(active);
    cursor.show(active);

    blocks.update(active);
    blocks.show();

    map_cursor_position(cursor.getPos());
}

function set_background() {
    let lerper = 0.05;
    bcg_col.curr.r = lerp(bcg_col.curr.r, bcg_col[active].r, lerper);
    bcg_col.curr.g = lerp(bcg_col.curr.g, bcg_col[active].g, lerper);
    bcg_col.curr.b = lerp(bcg_col.curr.b, bcg_col[active].b, lerper);
    background(bcg_col.curr.r, bcg_col.curr.g, bcg_col.curr.b);
}

function mousePressed() {
    active = true;
    tremolo.start();
    let new_chord = get_new_chord();

    for (let i=0; i<oscillators.length; i++) {
        oscillators[i].pitch = new_chord[i];
        oscillators[i].oscillator.triggerAttack(oscillators[i].pitch);
    }

    return false;
}

function mouseReleased() {
    active = false;
    oscillators.forEach(function(o) {
        o.oscillator.triggerRelease();
    });

    return false;
}

function map_cursor_position(pos) {
    let ramp_val = 0.1;

    // Tremolo Mapping
    let t_control = map(pos, 0, height, 0.1, 1.0, true)
    tremolo.depth.rampTo(t_control, ramp_val);

    // Volume Mapping
    let m_vol_control = map(pos, 0, height, -20, 0, true);
    master_vol.volume.rampTo(m_vol_control, ramp_val);

    // Reverb Mapping
    let r_control = map(pos, 0, height, 0.95, 0.1, true);
    reverb.roomSize.rampTo(r_control, ramp_val);

    // Individual Instrument Mapping
    let o_vol_control = map(pos, 0, height, -40, -12, true)
    oscillators[0].panner.volume.rampTo(o_vol_control, ramp_val);
    oscillators[oscillators.length-1].panner.volume.rampTo(o_vol_control, ramp_val);

}

function inverted_y() {
    return height - mouseY;
}

//
function build_oscillators(num_oscillators, tremolo, reverb, reverb_vol, master_vol) {
    let new_oscillators = [];
    let pan_max = 0.8;

    for (i=0; i<num_oscillators; i++) {
        let new_oscillator = build_oscillator();
        let new_panner = new Tone.PanVol(map(i, 0, num_oscillators, -0.8, 0.8), -12);

        new_oscillator.chain(new_panner, tremolo, reverb, reverb_vol, master_vol, Tone.Master);
        new_oscillator.chain(new_panner, tremolo, master_vol, Tone.Master);

        new_oscillators.push({
            oscillator: new_oscillator,
            panner: new_panner,
            pitch: c0[i]  // This should be overwritten on first mouse click
        });
    }

    return new_oscillators;
}

// Swap out code here for new oscillator.
// Must return some Tone synth object
function build_oscillator() {
    return new Tone.Synth({
        'oscillator': {
            type: ['sine', 'triangle'][floor(random(2))]
        },
        'envelope': {
            attack: 1,
            decay: 0.0,
            sustain: 1,
            release: 1
        }
    });
}

// Relies on global variables, line_one and score
function get_new_chord() {
    if (!(score.length)) {
        score = shuffle_array(line_one);
    }
    return score.shift();
}

function shuffle_array(arr) {
    let cpy = arr.slice(0);
    for (var i = cpy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cpy[i];
        cpy[i] = cpy[j];
        cpy[j] = temp;
    }

    return cpy;
}
