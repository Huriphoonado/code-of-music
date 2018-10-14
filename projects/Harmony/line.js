function Line(synth) {
    this.x = floor(map(synth.pan, -1, 1, 0, width));
    this.y = height;

    this.height = height;
    this.width = {
        small: 1,
        big: 8,
        curr: 1
    }

    this.synth = synth.synth;

    this.alive = true;

    this.lifespan = synth.time;
    this.start_time = millis();
    this.end_time = this.start_time + this.lifespan;
    this.halfway = (this.end_time + this.start_time) / 2;

    this.color = floor(255 * map(this.lifespan, 10000, 20000, 1, 0.5));

    this.update = function(active=false) {
        this.check_status();
        this.update_width();
        this.update_y();
    }

    this.show = function(active=false) {
        stroke(this.color);
        fill(this.color);
        rect(this.x, this.y, this.width.curr, this.height);
    }

    this.update_y = function() {
        this.y = this.invert_y(map(millis(), this.start_time, this.end_time, 0, height + this.height));
    }

    this.update_width = function() {
        if (millis() < this.halfway) {
            this.width.curr = map(millis(), this.start_time, this.halfway, this.width.small, this.width.big);
        }
        else {
            this.width.curr = map(millis(), this.halfway, this.end_time, this.width.big, this.width.small);
        }
    }

    this.check_status = function() {
        if (millis() > this.end_time) {
            this.alive = false;
        }
        return this.alive;
    }

    this.invert_y = function(y_val) {
        return height - y_val;
    }
}

function Lines() {
    this.line_list = [];

    this.update = function(active=false) {
        this.remove_dead();
        this.line_list.forEach(function(l) {
            l.update(active);
        });
    }

    this.show = function(active=false) {
        this.line_list.forEach(function(l) {
            l.show(active);
        });
    }

    this.addLine = function(synthObj) {
        this.line_list.push(new Line(synthObj));
    }

    this.remove_dead = function() {
        let self = this;
        let dead_list = [];
        for (let i=0; i<this.line_list.length; i++) {
            if (!(this.line_list[i].alive)) {
                dead_list.unshift(i); // Add to beginning rather than end
            }
        }
        dead_list.forEach(function(i) {
            self.line_list.splice(i, 1);
        })
    }

    this.clear = function() {
        this.line_list = [];
    }

    this.length = function() {
        return this.line_list.length;
    }
}
