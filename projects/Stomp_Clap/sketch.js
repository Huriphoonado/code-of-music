let bell; // Arrays to hold our sounds
let c_width = 400; // Window Size params
let c_height = 840;
let probs = 0.7; // Probability of playing a clap sound
let txt = 'click'

let particles = [];

function preload() {
	bell = loadSound('bell.wav')
}

function setup() {
  createCanvas(c_width, c_height);
  background(220);

  for (var i = 0; i < width; i++) {
	  particles.push(new Particle(i, height));
  }

  delay = new p5.Delay();
  delay.setType('pingPong');
  delay.process(bell, 0.9, 0.8, 2000);

  reverb = new p5.Reverb();
  reverb.process(delay, 3, 2);
}

function draw() {
	background(220);

	textSize(32);
	fill(50);
    text(txt, 10, 30);

	for (var i = 0; i < particles.length; i++) {
   		particles[i].update();
   		particles[i].show();
 	}
}

function keyReleased() {
	playSound();
}

function mouseClicked() {
	txt = 'press any button';
}

function playSound() {
	let start_time = 0;
	let playback_speed = int(random(-20, 20)) / 2;
	let choose_sound = int(random(10));
	let amp = random(0.2, 0.8);

	bell.play(start_time, playback_speed, amp);

	for (var i = 0; i < particles.length; i++) {
   		particles[i].launch();
	}
	txt = '';

	return bell;
}
