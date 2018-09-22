function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.bumped = false;
    let small_radius = 4;
    let big_radius = 16;
    let rand_add = 0.2;

    this.update = function() {
        let rand_x = random(-rand_add, rand_add)
        let rand_y = random(-rand_add, rand_add)
        this.x += rand_x;
        this.y += rand_y;
        this.updateSize();
        console.log(this.bumped, this.radius);
    }

   this.show = function() {
       fill(255);
       stroke(255);
       ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updateSize = function() {
        let size_diff = 2.0;
        if (this.bumped && this.radius < (big_radius)) {
            this.radius += size_diff;
        }
        else if (this.bumped && this.radius >= (big_radius)) {
            this.bumped = false;
            this.radius -= size_diff;
        }
        else if (!this.bumped && this.radius > small_radius) {
            this.radius -= size_diff;
        }
        else {
            this.radius = small_radius;
        }
    }

    this.bump = function() {
        this.bumped = true;
        console.log('here')
    }
}
