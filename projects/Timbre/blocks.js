function Block(x, b_width, min_mouse) {
    let lerp_val = 0.05;

    // Horizontal position/shape never changes
    this.x = x;
    this.b_width = b_width;

    this.min_height = height / 10;
    this.max_height = height - (height / 10);

    // How tall now, and how tall could it get?
    this.b_height = 0;
    this.potential = floor(random(this.min_height, this.max_height));

    // Mouse position is used as a button - when mouse is low enough, trigger
    this.min_mouse = min_mouse;
    this.we_just_randomized = true;

    this.update = function() {
        this.updateSize();
    }

    this.show = function() {
        // May need to play with how its size changes
        // Potential fix for testing - set at height/2
        this.updateColor();
        rect(this.x, height - this.b_height, this.b_width, this.b_height, 15, 15, 0, 0);
    }

    this.updateSize = function() {
        this.random_chance();
        this.random_size_on_switch();
        let destinatation_height = this.calculate_height();
        this.b_height = lerp(this.b_height, destinatation_height, lerp_val);
    }

    this.updateColor = function() {
        let color = map(this.b_height, 0, height, 50, 200);
        stroke(color);
        fill(color);
    }

    // If this happens randomly - it may lead to occasionally shifting blocks
    this.random_size_on_switch = function() {
        if (this.inverted_y() <= this.min_mouse && !(this.we_just_randomized)) {
            this.potential = floor(random(this.min_height, this.max_height));
            this.we_just_randomized = true;
            console.log(this.potential);
        }
        else if (this.inverted_y() > this.min_mouse) {
            this.we_just_randomized = false;
        }
    }

    this.calculate_height = function() {
        return map(this.inverted_y(), 0, height, 0, this.potential, true);
    }

    this.random_chance = function() {
        let random_chance = 0.05;
        let random_num = random(0, 100);
        if (random_num <= random_chance) {
            this.potential = floor(random(this.min_height, this.max_height));
        }
    }

    // Invert y coordinates so that the bottom of the screen is zero
    this.inverted_y = function() {
        return height - mouseY;
    }


}

function Blocks(num_blocks, min_mouse) {
    this.blocks = [];
    for (let i = 0; i<num_blocks; i++) {
        let new_width = width/num_blocks;
        let new_pos = floor(map(i, 0, num_blocks, 0, width));
        this.blocks.push(new Block(new_pos, new_width, min_mouse));
    }

    this.show = function() {
        this.blocks.forEach(function(block) {
            block.show();
        });
    }

    this.update = function() {
        this.blocks.forEach(function(block) {
            block.update();
        });
    }
}
