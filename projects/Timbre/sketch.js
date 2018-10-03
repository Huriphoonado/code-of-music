// Willie Payne
// Debussy Timbre Thingy

const c_width = 600; // Window Size params
const c_height = 400;

let blocks;

function setup() {
    createCanvas(c_width, c_height);
    background(220);
    blocks = new Blocks(60, height/10);
}

function draw() {
    background(220);
    blocks.update();
    blocks.show();
}
