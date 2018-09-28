function Particle(beat, pitch, type, grid) {

    Particle.positions = Particle.positions || generate_zeros(grid.pitches, grid.beats);

    this.active = true; // After it has played a number of times, it will stop

    this.beat = beat; // Beat
    this.pitch = pitch; // Pitch
    let pos = grid.get_position(beat, pitch);
    this.x = pos.x;
    this.y = pos.y;

    this.radius = 4;
    this.bumped = false;
    this.color = 200;
    this.played = 16 * grid.beats; // number of beats to live for

    // 'horizontal', 'vertical', 'none'
    this.type = type;

    let movement_chance = 0.1;

    this.update = function() {
        this.updatePos();
        // this.updateSize();
    }

   this.show = function() {
       this.updateColor();
       ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updatePos = function() {
        this.random_move();

        let pos = grid.get_position(this.beat, this.pitch);

        this.x = lerp(this.x, pos.x, 0.05);
        this.y = lerp(this.y, pos.y, 0.05);
    }

    this.updateColor = function() {
        /*let c_x = map(this.x, 0, width, 40, 125);
        let c_y = map(this.y, 0, height, 40, 125);
        let new_color = c_x + c_y;
        this.color = lerp(this.color, new_color, 0.05);*/
        stroke(this.color);
        fill(this.color);
    }

    this.bump = function() {
        this.bumped = true;
        this.played -= 1;

        if (this.played <= 0) {
            this.deactivate();
        }
    }

    this.deactivate = function() {
        this.active = false;
        Particle.positions[this.beat][this.pitch] = 0;
        return false;
    }

    // Either call in loop or bump
    this.random_move = function() {
        if (this.type == 'none') {
            return;
        }

        let new_rand = rand(100);
        if (new_rand < movement_chance) {
            if (type == 'vertical') {
                this.vertical_move()
            }
            else if (type == 'horizontal') {
                this.horizontal_move()
            }
        }
    }

    this.horizontal_move = function() {
        let possiblities = [-1, 1];
        let new_beat = this.beat + possiblities[floor(rand(possiblities.length))];

        // If there is already a note there - do nothing
        if (Particle.positions[new_beat][this.pitch]) return;

        // Otherwise, update the beat array
        Particle.positions[this.beat][this.pitch] = 0;
        this.beat = new_beat;
        Particle.positions[this.beat][this.pitch] = 1;
    }

    this.vertical_move = function() {
        let possiblities = [-1, 1];
        let new_pitch = this.pitch + possiblities[floor(rand(possiblities.length))];

        // If there is already a note there - do nothing
        if (Particle.positions[this.beat][new_pitch]) { return };

        // Otherwise, update the beat array
        Particle.positions[this.beat][this.pitch] = 0;
        this.pitch = new_pitch;
        Particle.positions[this.beat][this.pitch] = 1;
    }
}

function arrays_equal(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function generate_zeros(rows, cols) {
    let new_arr = Array(rows).fill().map(() => Array(cols).fill(0));
    return new_arr;
}
