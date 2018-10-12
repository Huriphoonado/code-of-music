// TODO
// Animate objects moving up the screen
// Position dependent on
// Get random synth parameters working
//  Probabilities
// Get particle class working such that there is a concept of memory
//  More particles as chord becomes more complex


let c_width = 400;
let c_height = 800;
let active = false;

let lines;

function setup() {
    createCanvas(c_width, c_height);
    background(200);

    lines = new Lines();
}

function draw() {
    background(200);

    lines.update(active);
    lines.show(active);
}

function keyReleased() {
    lines.addLine();
    console.log(lines.length());
}
