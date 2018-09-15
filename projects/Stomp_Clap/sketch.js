let claps, stomps, sounds; // Arrays to hold our sounds
let c_width = 400;
let c_height = 400;
let probs = 0.7; // Probability of playing a clap sound

let particles = [];

function preload() {
	// Ideally, these are loaded dynamically rather than each file being
	// spelled out.
	let c0 = loadSound('Claps/event004.wav');
	let c1 = loadSound('Claps/event015.wav');
	let c2 = loadSound('Claps/event025.wav');
	let c3 = loadSound('Claps/event030.wav');
	let c4 = loadSound('Claps/event031.wav');
	let c5 = loadSound('Claps/event066.wav');
	let c6 = loadSound('Claps/event071.wav');
	let c7 = loadSound('Claps/event073.wav');
	let c8 = loadSound('Claps/event090.wav');
	let c9 = loadSound('Claps/event095.wav');

	let s0 = loadSound('Stomps/event002.wav');
	let s1 = loadSound('Stomps/event003.wav');
	let s2 = loadSound('Stomps/event009.wav');
	let s3 = loadSound('Stomps/event023.wav');
	let s4 = loadSound('Stomps/event043.wav');
	let s5 = loadSound('Stomps/event067.wav');
	let s6 = loadSound('Stomps/event068.wav');
	let s7 = loadSound('Stomps/event077.wav');
	let s8 = loadSound('Stomps/event078.wav');
	let s9 = loadSound('Stomps/event081.wav');

	claps = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9];
	stomps = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
	sounds = [stomps, claps];
}

function setup() {
  createCanvas(c_width, c_height);
  background(220);

  for (var i = 0; i < width; i++) {
	  particles.push(new Particle(i, height));
  }
}

function draw() {
	background(220);

	for (var i = 0; i < particles.length; i++) {
   		particles[i].update();
   		particles[i].show();
 	}

	// let angle = map(sound.currentTime(), 0, sound.duration(), 0, TWO_PI);
	// push()
	// translate(width/2, height/2);
	// rotate(angle);
	// rect(0, 0, 100, 100);
	// pop();
}

function keyReleased() {
	playRandSound();
}

function playRandSound() {
	let choose_type = int(random(100)/100. <= probs);
	let choose_sound = int(random(10));
	let s = sounds[choose_type][choose_sound];
	s.play();

	if (choose_type) {
		for (var i = 0; i < particles.length; i++) {
	   		particles[i].launch();
	 	}
	}
	else {
		for (var i = 0; i < particles.length; i++) {
	   		particles[i].launch();
	 	}
	}

	return s;
}

function animateFloor() {
	for (let i = 0; i < c_width; i++) {
		let r = random(c_height);
		animateLine(i, r)
  		//stroke(r / 2);
  		//line(i, c_height, i, c_height - r);
	}

}

function animateLine(x_pos, r) {
	let num_loops = 20;
	for (let i = 0; i < num_loops; i++) {
		let l_height = map(i, 0, num_loops, 0, r);
		stroke(r / 2);
		line(x_pos, c_height, x_pos, c_height - l_height);
	}

}
