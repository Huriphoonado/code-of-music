function Particle(beat, pitch, grid) {
    let large_radius = 8;
    let small_radius = 2;

    Particle.positions = Particle.positions || generate_zeros(grid.pitches, grid.beats);
    Particle.positions[pitch][beat] = 1;

    this.active = true; // After it has played a number of times, it will stop

    this.beat = beat; // Beat
    this.pitch = pitch; // Pitch
    this.x = 0;
    this.y = random(height);

    this.grid = grid;

    this.radius = large_radius;
    this.bumped = false;
    this.colors = {
        'none': {r: 211, g: 229, b: 255},
        'horizontal': {r: 201, g: 98, b: 101},
        'vertical': {r: 86, g: 248, b: 199}
    }

    this.lifetime = floor(random(18, 28)); // number of beats to live for
    this.played = this.lifetime;

    let types = ['horizontal', 'vertical', 'none'];
    this.type = types[floor(random(3))];

    let movement_chance = random(0.05, 0.2);

    this.update = function() {
        this.updatePos();
        this.updateSize();
    }

   this.show = function() {
       this.updateColor();
       ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updatePos = function() {
        this.random_move();

        let pos = this.grid.get_position(this.beat, this.pitch);

        this.x = lerp(this.x, pos.x, 0.05);
        this.y = lerp(this.y, pos.y, 0.05);
    }

    this.updateColor = function() {
        stroke(this.colors[this.type].r, this.colors[this.type].g, this.colors[this.type].b);
        fill(this.colors[this.type].r, this.colors[this.type].g, this.colors[this.type].b);
    }

    // Particle shrinks as it nears death...
    this.updateSize = function() {
        let base_radius = map(this.played, 0, this.lifetime,
             small_radius, large_radius);
        let proportion = this.grid.get_radius(this.beat, this.pitch);
        this.radius = base_radius * proportion;
    }

    this.bump = function() {
        this.bumped = true;
        this.played -= 1;

        if (this.played == 0) {
            this.deactivate();
        }
    }

    this.deactivate = function() {
        this.active = false;
        Particle.positions[this.pitch][this.beat] = 0;
        return false;
    }

    // Either call in loop or bump
    this.random_move = function() {
        if (this.type == 'none') {
            return;
        }

        let new_rand = random(100);
        if (new_rand < movement_chance) {
            if (this.type == 'vertical') {
                this.vertical_move()
            }
            else if (this.type == 'horizontal') {
                this.horizontal_move()
            }
        }
    }

    this.horizontal_move = function() {
        let possiblities = [-1, 1];
        let new_beat = mod((this.beat + possiblities[floor(random(possiblities.length))]), grid.beats);

        // If there is already a note there - do nothing
        if (Particle.positions[this.pitch][new_beat]) return;

        // Otherwise, update the beat array
        Particle.positions[this.pitch][this.beat] = 0;
        this.beat = new_beat;
        Particle.positions[this.pitch][this.beat] = 1;
    }

    this.vertical_move = function() {
        let possiblities = [-1, 1];
        let new_pitch = mod((this.pitch + possiblities[floor(random(possiblities.length))]), grid.pitches);

        // If there is already a note there - do nothing
        if (Particle.positions[new_pitch][this.beat]) { return };

        // Otherwise, update the beat array
        Particle.positions[this.pitch][this.beat] = 0;
        this.pitch = new_pitch;
        Particle.positions[this.pitch][this.beat] = 1;
    }

    this.get_lifespan = function() {
        return map(this.played, 0, this.lifetime,
             0, 1);
    }
}

function generate_zeros(rows, cols) {
    let new_arr = Array(rows).fill().map(() => Array(cols).fill(0));
    return new_arr;
}

// Javascript modulus doesn't wrap negatives around!
function mod(n, m) {
  return ((n % m) + m) % m;
}
