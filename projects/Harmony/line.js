function Line(synth=false) {
    this.x = floor(random(width));
    this.y = height;
    this.synth = synth;

    this.alive = true;

    this.lifespan = 20000;
    this.start_time = millis();
    this.end_time = this.start_time + this.lifespan;


    this.update = function(active=false) {
        this.check_status();
        this.update_y();
    }

    this.show = function(active=false) {
        stroke(255);
        fill(255);
        rect(this.x, this.y, 30, 30);
    }

    this.update_y = function() {
        this.y = this.invert_y(map(millis(), this.start_time, this.end_time, 0, height));
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

    this.addLine = function() {
        this.line_list.push(new Line());
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
