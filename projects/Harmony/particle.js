function Particle() {
    this.height = height/1.5;

    this.y = -this.height;
    this.x = random(width);

    this.speed = {min: 15, max: height/18};
    this.speed.curr = this.speed.min;

    this.color = {
        true: {r: 0, g: 102, b: 153},
        false: {r: 202, g: 170, b: 121},
        curr: {r: 202, g: 170, b: 121}
    }
    this.dark = random(0.5, 1);
    this.weight = map(this.dark, 0.5, 1, 1, 4)

    this.update = function(active=false) {
        this.update_speed();
        this.y += this.speed.curr;
    }

    this.show = function(active=false) {
        push();
        this.update_color(active);
        line(this.x, this.y, this.x, this.y + this.height);
        pop();
    }

    this.update_speed = function() {
        this.speed.curr = map(this.y, 0, height, this.speed.min, this.speed.max, true);
    }

    this.update_color = function(active=false) {
        let lerper = 0.2;
        this.color.curr.r = lerp(this.color.curr.r, this.color[active].r, lerper);
        this.color.curr.g = lerp(this.color.curr.g, this.color[active].g, lerper);
        this.color.curr.b = lerp(this.color.curr.b, this.color[active].b, lerper);
        strokeWeight(this.weight);
        stroke(this.color.curr.r * this.dark,
               this.color.curr.g * this.dark,
               this.color.curr.b * this.dark);
    }

}

function Particles() {
    this.particle_list = [];
    this.total_particles = 100;
    this.probs = {
        'min': 1,
        'max': 40,
        'curr': 1
    }

    this.update = function(active=false, num_pitches=0) {
        // Simpler/Stupid way of clearing out-of-bounds particles
        if (this.particle_list.length > this.total_particles) {
            this.particle_list.pop();
        }

        this.try_to_add_particle(num_pitches);

        this.particle_list.forEach(function(p) {
            p.update(active);
        })
    }

    this.show = function(active=false) {
        this.particle_list.forEach(function(p) {
            p.show(active);
        })
    }

    this.try_to_add_particle = function(num_pitches) {
        this.probs['curr'] = map(num_pitches, 0, 20, this.probs['min'], this.probs['max'], true)
        let rand_val = random(100);

        if (rand_val <= this.probs['curr']) {
            this.particle_list.unshift(new Particle());
        }
    }

    this.clear = function() {
        this.particle_list = [];
    }
}
