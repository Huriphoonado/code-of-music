// TODO
// Animate objects moving up the screen
// Position dependent on
// Get random synth parameters working
//  Probabilities
// Get particle class working such that there is a concept of memory
//  More particles as chord becomes more complex
// Idea spacebar needs to be held down to successfully launch


let c_width = 400;
let c_height = 800;
let active = false;

// In the initial idea, they were lines, but in the end I decided on boxes
let lines;
let particles;

function setup() {
    createCanvas(c_width, c_height);
    background(50);

    particles = new Particles();
    lines = new Lines();
}

function draw() {
    background(50);

    particles.update(active, lines.length());
    particles.show(active);

    lines.update(active);
    lines.show(active);
}

function keyReleased() {
    lines.addLine();
}
