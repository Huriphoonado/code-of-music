function GridPoint(x, y) {
    let small_radius = 12;
    let big_radius = 28;

    this.x = x;
    this.y = y;

    this.color = 100;
    this.radius = small_radius;
    this.bumped = false;

    this.update = function() {
        this.updateSize();
    }

    this.show = function() {
        stroke(this.color);
        fill(this.color);
        ellipse(this.x, this.y, this.radius, this.radius);
    }

    this.updateSize = function() {
        let size_diff = 1.5;
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
    }
}

function Grid(beats, pitches) {
    let x_offset = width/10;
    let y_offset = height/5;

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

    this.bump_column = function(col_n) {
        for (let i = 0; i < this.pitches; i++) {
            this.gridpoints[col_n][i].bump();
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
