// Idea - slider such that the user is either hearing pulses, or more ambient notes
// Probability value for triggering an lfo that fades in the pitches
// Constellation of stars
// Perfume Genius - 'Slip Away'
// 'Music for Wood and Strings'

let c_width = 400;
let c_height = 400;

let guitars;
let roboPlayer;

let active = false;

function setup() {
    Tone.Transport.start();
    guitars = new Guitars();
    guitars.loadAll();

    roboPlayer = new RoboPlayer(guitars);
    // roboPlayer.start();

    createCanvas(c_width, c_height);
    background(100);

}

function draw() {
    background(100);
}

function mouseReleased() {
    // guitars.play(pitches=['C', 'E', 'F', 'G', 'B'], octave='high', type='harmonics');
    //guitars.burst(pitches=['C', 'E', 'F', 'G', 'B'], octave='high', type='harmonics');

    if (active) {
        roboPlayer.stop();
        active = false;
    }
    else {
        roboPlayer.start();
        active = true;
    }
}
