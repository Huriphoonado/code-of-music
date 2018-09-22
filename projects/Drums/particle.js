function Particle(x, y) {
    let small_radius = 4;
    let big_radius = 16;
    let rand_add = 0.2;
    this.x = x;
    this.y = y;
    this.radius = small_radius;
    this.bumped = false;

    this.update = function() {
        this.updatePos();
        this.updateSize();
    }

   this.show = function() {
       this.updateColor();
       ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updatePos = function() {
        let rand_x = random(-rand_add, rand_add)
        let rand_y = random(-rand_add, rand_add)
        this.x += rand_x;
        this.y += rand_y;
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

    this.updateColor = function() {
        let c_x = map(this.x, 0, width, 50, 120);
        let c_y = map(this.y, 0, width, 50, 120);
        stroke(c_x + c_y);
        fill(c_x + c_y);
    }

    this.bump = function() {
        this.bumped = true;
    }
}
