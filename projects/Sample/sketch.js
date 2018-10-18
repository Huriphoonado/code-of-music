// Idea - slider such that the user is either hearing pulses, or more ambient notes
// Probability value for triggering an lfo that fades in the pitches
// Perfume Genius - 'Slip Away'
// 'Music for Wood and Strings'

let c_width = 400;
let c_height = 400;

let guitars;

function setup() {
    guitars = new Guitars();
    guitars.loadAll();

    createCanvas(c_width, c_height);
    background(100);
    console.log(guitars.guitarList);
}

function draw() {
    background(100);
}

function mouseReleased() {
    guitars.play();
}
