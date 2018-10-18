let c_width = 400;
let c_height = 400;

let guitars = new Guitars();

function setup() {
    guitars.loadAll();
    createCanvas(c_width, c_height);
    background(100);
    console.log(guitars.guitars);
}

function draw() {
    background(100);
}

function mouseReleased() {
    guitars.playRandom();
}
