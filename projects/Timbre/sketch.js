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
const trigger_height = c_height/10;

let blocks;
let oscillators;

let num_oscillators = 6;

let tremolo = new Tone.Tremolo(8, 0.5).start();
tremolo.type = 'triangle';
tremolo.spread = 10;
let reverb = new Tone.JCReverb(0.8);
let reverb_vol = new Tone.Volume(-8);
let master_vol = new Tone.Volume(0);

function setup() {
    createCanvas(c_width, c_height);
    set_background();
    oscillators = build_oscillators(num_oscillators, tremolo, reverb, reverb_vol, master_vol);
    blocks = new Blocks(60, trigger_height);
}

function draw() {
    set_background();
    blocks.update(active);
    blocks.show();

    map_mouse_position();
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
    oscillators.forEach(function(o) {
        o.oscillator.triggerAttack(o.pitch);
    });

    return false;
}

function mouseReleased() {
    active = false;
    oscillators.forEach(function(o) {
        o.oscillator.triggerRelease();
    });

    return false;
}

function map_mouse_position() {
    // console.log(tremolo.depth);
    let i_y = inverted_y();

    // Tremolo Mapping
    let t_control = map(i_y, 0, height, 0.1, 1.0, true)
    tremolo.depth.rampTo(t_control, 0.1);

    // Volume Mapping
    let m_vol_control = map(i_y, 0, height, -20, 0, true);
    master_vol.volume.rampTo(m_vol_control, 0.1);

    // Individual Instrument Mapping
    let o_vol_control = map(i_y, 0, height, -40, -12, true)
    oscillators[0].panner.volume.rampTo(o_vol_control, 0.1);
    oscillators[oscillators.length-1].panner.volume.rampTo(o_vol_control, 0.1);

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
            pitch: 'C' + i
        });
    }

    return new_oscillators
}

// Swap out code here for new oscillator.
// Must return some Tone synth object
function build_oscillator() {
    return new Tone.Synth({
        'oscillator': {
            type: 'triangle'
        },
        'envelope': {
            attack: 1,
            decay: 0.0,
            sustain: 1,
            release: 1
        }
    });
}
