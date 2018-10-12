function Particle() {
    this.y = 0;
    this.x = random(width);

    this.height = 40;

    this.speed = {'min': 1, 'max': height/10};
    this.speed['curr'] = random(this.speed['min'], this.speed['max']);

    this.color = {
        curr: {r: 202, g: 170, b: 121}
    }

    this.update = function(active=false) {
        this.y += this.speed['curr'];
    }

    this.show = function(active=false) {
        push();
        strokeWeight(4);
        stroke(this.color.curr.r, this.color.curr.g, this.color.curr.b);
        line(this.x, this.y, this.x, this.y + this.height);

        pop();
    }

}

function Particles() {
    this.particle_list = [];
    this.total_particles = 100;
    this.probs = {
        'min': 1,
        'max': 20,
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
        this.probs['curr'] = map(num_pitches, 0, 10, this.probs['min'], this.probs['max'], true)
        let rand_val = random(100);

        if (rand_val <= this.probs['curr']) {
            this.particle_list.unshift(new Particle());
        }
    }

    this.clear = function() {
        this.particle_list = [];
    }
}
