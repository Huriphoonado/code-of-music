function GridPoint(x, y) {
    let inactive_color = {r: 100, g: 100, b: 100};
    let active_color = [
        {r: 40, g: 14, b: 20},
        {r: 42, g: 90, b: 162}
    ];
    this.small_radius = height/30;
    this.big_radius = height/14;
    this.bump_amount = this.small_radius/10;

    this.x = x;
    this.y = y;

    this.current_color = Object.assign({}, inactive_color);
    this.color = Object.assign({}, inactive_color);
    this.radius = this.small_radius;
    this.bumped = false;

    this.update = function() {
        this.updateSize();
        this.updateColor();
    }

    this.show = function() {
        ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updateSize = function() {
        let size_diff = 1.5;
        if (this.bumped && this.radius < (this.big_radius)) {
            this.radius += this.bump_amount;
        }
        else if (this.bumped && this.radius >= (this.big_radius)) {
            this.bumped = false;
            this.radius -= this.bump_amount;
        }
        else if (!this.bumped && this.radius > this.small_radius) {
            this.radius -= this.bump_amount;
        }
        else {
            this.radius = this.small_radius;
        }
    }

    this.updateColor = function() {
        this.color.r = lerp(this.color.r, this.current_color.r, 0.05);
        this.color.g = lerp(this.color.g, this.current_color.g, 0.05);
        this.color.b = lerp(this.color.b, this.current_color.b, 0.05);

        stroke(this.color.r, this.color.g, this.color.b);
        fill(this.color.r, this.color.g, this.color.b);
    }

    this.bump = function() {
        this.bumped = true;
    }

    this.changeMode = function(scale_mode) {
        this.current_color.r = active_color[scale_mode].r;
        this.current_color.g = active_color[scale_mode].g;
        this.current_color.b = active_color[scale_mode].b;
    }

    this.activate = function(scale_mode) {
        this.current_color.r = active_color[scale_mode].r;
        this.current_color.g = active_color[scale_mode].g;
        this.current_color.b = active_color[scale_mode].b;
    }

    this.deactivate = function() {
        this.current_color.r = inactive_color.r;
        this.current_color.g = inactive_color.g;
        this.current_color.b = inactive_color.b;
    }
}

function Grid(beats, pitches) {
    let x_offset = width/10;
    let y_offset = height/10;

    this.beats = beats;
    this.pitches = pitches;

    // Stores the pixel positions of all the points in the grid
    this.position_array = generate_positions(beats, pitches, x_offset, y_offset);

    // Stores all the ellipses that get drawn in the grid
    this.gridpoints = create_grid(this.position_array);

    this.show = function() {
        for (let i = 0; i < this.beats; i++) {
            for (let j = 0; j < this.pitches; j++) {
                this.gridpoints[i][j].update();
                this.gridpoints[i][j].show();
            }
        }
    }

    // Add half of radius to get the center
    this.get_position = function(pos_x, pos_y) {
        return this.position_array[pos_x][pos_y];
    }

    // returns the proportion of the current radius to its small size
    // This can be used to control other points on the grid
    this.get_radius = function(pos_x, pos_y) {
        let current = this.gridpoints[pos_x][pos_y].radius;
        let small = this.gridpoints[pos_x][pos_y].small_radius;
        return (current / small);
    }

    this.bump_column = function(col_n) {
        for (let i = 0; i < this.pitches; i++) {
            this.gridpoints[col_n][i].bump();
        }
    }

    this.activate = function(scale_mode) {
        for (let i = 0; i < this.beats; i++) {
            for (let j = 0; j < this.pitches; j++) {
                this.gridpoints[i][j].activate(scale_mode);
            }
        }
    }
    this.deactivate = function() {
        for (let i = 0; i < this.beats; i++) {
            for (let j = 0; j < this.pitches; j++) {
                this.gridpoints[i][j].deactivate();
            }
        }
    }
}

// Make sure this is called in p5 setup function
function generate_positions(beats, pitches, x_offset, y_offset) {
    let position_array = [];

    for (let i = 0; i < beats; i++) {
        let new_row = [];
        for (let j = 0; j < pitches; j++) {
            let position = {
                x: map(i, 0, beats - 1, x_offset, width - x_offset),
                y: map(j, 0, pitches - 1, y_offset, height - y_offset),
            };
            new_row.push(position);
        }
        position_array.push(new_row);
    }
    return position_array;
}

function create_grid(position_array) {
    let gridpoints = [];

    for (let i = 0; i < position_array.length; i++) {
        let new_row = [];
        for (let j = 0; j < position_array[i].length; j++) {
            let new_pos = position_array[i][j];
            let gp = new GridPoint(new_pos.x, new_pos.y);
            new_row.push(gp);
        }
        gridpoints.push(new_row);
    }
    return gridpoints;
}
