let c_width = 800;
let c_height = 400;

let tutorial_text = [
    'press any button to generate new pitches',
    'click on me to hear.',
    ''
];

let background_img;
let bcg_col = {
    false: {r: 10, g: 10, b: 10},
    true: {r: 0, g: 102, b: 153},
    curr: {r: 10, g: 10, b: 10}
}

let guitars;
let roboPlayer;
let stars;

let active = false;

function preload() {
    background_img = loadImage("image/sky.jpg");
}

function setup() {
    Tone.Transport.start();
    guitars = new Guitars();
    guitars.loadAll();

    roboPlayer = new RoboPlayer(guitars);

    // Current Implementation: Buggy
    // This doesn't seem to do anything, maybe because the guitars haven't loaded yet
    // In the future, I'll need to add this to a callback
    resetAudioVisualParams();

    createCanvas(c_width, c_height);
    set_background();

}

function draw() {
    set_background();

    stars.update();
    stars.show();

    drawText();
}

function mouseReleased() {
    if (active) {
        roboPlayer.stop();
        active = false;
    }
    else {
        roboPlayer.start();
        active = true;
    }

    if (tutorial_text.length == 2) {
        tutorial_text.shift();
    }
}

function keyReleased() {
    resetAudioVisualParams();

    if (tutorial_text.length == 3) {
        tutorial_text.shift();
    }
}

function resetAudioVisualParams() {
    let newGuitarList = roboPlayer.resetSettings();
    reset_background();
    stars = new Stars(newGuitarList, bcg_col.curr);
}

function set_background() {
    let lerper = 0.05;
    bcg_col.curr.r = lerp(bcg_col.curr.r, bcg_col[active].r, lerper);
    bcg_col.curr.g = lerp(bcg_col.curr.g, bcg_col[active].g, lerper);
    bcg_col.curr.b = lerp(bcg_col.curr.b, bcg_col[active].b, lerper);
    background(bcg_col.curr.r, bcg_col.curr.g, bcg_col.curr.b);
}

// Photo by Kristopher Roller on Unsplash
function reset_background() {
    let pix_x = floor(random(background_img.width));
    let pix_y = floor(random(background_img.height));
    let pix = background_img.get(pix_x, pix_y);

    bcg_col[true].r = pix[0];
    bcg_col[true].g = pix[1];
    bcg_col[true].b = pix[2];
}

function drawText() {
    fill(250);
    textSize(40);
    text(tutorial_text[0], width*0.05, height*0.1);
}
