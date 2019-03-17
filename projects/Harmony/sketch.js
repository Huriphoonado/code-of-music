let c_width = 400;
let c_height = 750;

let bcg_col = {
    true: {r: 50, g: 50, b: 50},
    false: {r: 0, g: 102, b: 153},
    curr: {r: 0, g: 102, b: 153}
}

let active = false;

// In the initial idea, they were lines, but in the end I decided on boxes
let lines;
let particles;

let tutorial_text = [
    'click to hear sound.',
    'press any button.',
    ''
];

function setup() {
    createCanvas(c_width, c_height);
    set_background();

    particles = new Particles();
    lines = new Lines();
}

function draw() {
    set_background();

    particles.update(active, lines.length());
    particles.show(active);

    lines.update(active);
    lines.show(active);

    drawText();
}

function keyReleased() {
    let synth_obj = new_synth();
    console.log(synth_obj);
    lines.addLine(synth_obj);

    if (tutorial_text.length == 2) {
        tutorial_text.shift();
    }

    return false;
}

function mouseReleased() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    
    if (mouseX < width && mouseY < height) {
        if (tutorial_text.length == 3) {
            tutorial_text.shift();
        }

        if (active) {
            active = false;
            master_vol.volume.rampTo(-100, 0.1);
        }
        else {
            active = true;
            master_vol.volume.rampTo(-40, 0.1);
        }
    }
}

function drawText() {
    fill(250);
    textSize(40);
    text(tutorial_text[0], width*0.05, height*0.1);
}

function set_background() {
    let lerper = 0.05;
    bcg_col.curr.r = lerp(bcg_col.curr.r, bcg_col[active].r, lerper);
    bcg_col.curr.g = lerp(bcg_col.curr.g, bcg_col[active].g, lerper);
    bcg_col.curr.b = lerp(bcg_col.curr.b, bcg_col[active].b, lerper);
    background(bcg_col.curr.r, bcg_col.curr.g, bcg_col.curr.b);
}
