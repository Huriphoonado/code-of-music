Tone.Transport.bpm.value = 60;
Tone.Transport.start();

let note_probs = [
    {pitch: 'A', prob: 0.2},
    {pitch: 'A#', prob: 0.22},
    {pitch: 'B', prob: 0.3},
    {pitch: 'C', prob: 0.4},
    {pitch: 'C#', prob: 0.44},
    {pitch: 'D', prob: 0.55},
    {pitch: 'D#', prob: 0.57},
    {pitch: 'E', prob: 0.77},
    {pitch: 'F', prob: 0.87},
    {pitch: 'F#', prob: 0.9},
    {pitch: 'G', prob: 1}
];

let octave_probs = [
    {octave: 2, prob: 0.05},
    {octave: 3, prob: 0.25},
    {octave: 4, prob: 0.45},
    {octave: 5, prob: 0.65},
    {octave: 6, prob: 0.85},
    {octave: 7, prob: 1}
];

let global_filt = new Tone.Filter(900, 'lowpass');
let reverb = new Tone.JCReverb(0.95);
let reverb_vol = new Tone.Volume(-6);
let master_vol = new Tone.Volume(-100);

function new_synth() {
    let rt1 = rand_time();
    let new_pitch = random_pitch();
    let pan_amount = random(-1, 1);

    let new_vibrato = new Tone.Vibrato (random(0.1, 1), random(0.1, 5))
    let chorus = new Tone.Chorus(4, 2.5, 0.5);
    let new_panner = new Tone.Panner(pan_amount);
    let new_filter = new Tone.AutoFilter({
        'frequency': random(0.01, 0.2),
        'type': 'sine' ,
        'depth': random(0.5, 1),
        'baseFrequency': floor(random(200, 500)),
        'octaves': [1, 2][floor(random(2))],
        'filter': {
            'Q': floor(random(10)),
            'type': 'lowpass',
            'rolloff': [-12, -24, -48, -96][floor(random(4))]
        }
    }).start();

    let synth = new Tone.Synth({
        'frequency': random_pitch(),

        'oscillator': {
            'type': rand_osc()
        },
        'envelope': {
            'attack': rt1,
            'decay': rt1,
            'sustain': 0.5,
            'release': 2
        }
    });

    synth.chain(new_panner, new_vibrato, reverb, reverb_vol, master_vol, global_filt, Tone.Master);
    synth.chain(new_panner, new_vibrato, master_vol, global_filt, Tone.Master);

    synth.triggerAttackRelease(new_pitch, rt1*2);

    return {synth: synth, time: (rt1 * 2000), pan: pan_amount}
}

function random_pitch() {
    let rand_note = random();
    let rand_octave = random();

    let new_note;
    let new_octave;

    for (i=0; i<note_probs.length; i++) {
        if (rand_note < note_probs[i].prob) {
            new_note = note_probs[i].pitch;
            break;
        }
    }

    for (i=0; i<octave_probs.length; i++) {
        if (rand_octave < octave_probs[i].prob) {
            new_octave = octave_probs[i].octave;
            break;
        }
    }
    return new_note + new_octave;
}

function rand_osc() {
    return ['sawtooth', 'triangle', 'square'][floor(random(3))]
}

function rand_time(min=5, max=10) {
    return random(min, max);
}

function return_master_vol() {
    return master_vol;
}
