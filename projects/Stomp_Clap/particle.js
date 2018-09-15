let gravity = 2;
let min_speed = 10;
let max_speed = 50;

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.fill = 0;

    this.history = [];

    this.update = function() {
        this.y += this.speed;
        this.speed += gravity;

        if (this.y >= height) {
            this.speed = 0;
        }

        var v = createVector(this.x, this.y);
        this.history.push(v);
        if (this.history.length > 100) {
         this.history.splice(0, 1);
       }
    }

   this.show = function() {
       stroke(this.fill);
       fill(this.fill, this.fill);

       beginShape();
       for (var i = 0; i < this.history.length; i++) {
           var pos = this.history[i];
           vertex(pos.x, pos.y);
           // ellipse(pos.x, pos.y, 4, 4);
        }
        endShape();
    }

    this.launch = function() {
        this.speed = -random(min_speed, max_speed);
        this.fill = map(-this.speed, 0, max_speed, 10, 200)
    }

}
