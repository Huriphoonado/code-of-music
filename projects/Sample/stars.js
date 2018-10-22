function Stars(guitar_list, b_color) {

    this.starlist = guitar_list.map(g => new Star(g, b_color));

    this.update = function() {
        this.starlist.forEach(function(star) {
            star.update();
        });
    }

    this.show = function() {
        this.starlist.forEach(function(star) {
            star.show();
        });
    }

}

function Star(guitar, b_color) {
    this.x = map(guitar.getPan(), -1, 1, 0, width);
    this.y = height - (map(guitar.getMIDIVal(), 24, 84, 0, height));
    this.guitar = guitar;

    this.size = {
        big: 30,
        small: 5,
        curr: 5
    };

    this.color = {
        start: {r: b_color.r, g: b_color.g, b: b_color.b},
        end: {r: 225, g: 225, b: 225},
        curr: {r: b_color.r, g: b_color.g, b: b_color.b}
    }

    this.update = function() {
        this.updateSize();
    }

    this.show = function() {
        this.updateColor();
        ellipse(this.x, this.y, this.size.curr, this.size.curr);
    }

    this.updateSize = function() {
        let lerper = 0.15;

        // Tone may already do thid, but just in case...
        if (this.guitar.player.state == 'stopped') {
            this.size.curr = lerp(this.size.curr, this.size.small, lerper);
            return;
        }

        // Based on amplitude - not the best mapping unfortunately
        let size_mapping = map(this.guitar.getMeter(), -40, -20, this.size.small, this.size.big, true);
        this.size.curr = lerp(this.size.curr, size_mapping, lerper);
        return;
    }

    this.updateColor = function() {
        let lerper = 0.02;
        this.color.curr.r = lerp(this.color.curr.r, this.color.end.r, lerper);
        this.color.curr.g = lerp(this.color.curr.g, this.color.end.g, lerper);
        this.color.curr.b = lerp(this.color.curr.b, this.color.end.b, lerper);
        stroke(this.color.curr.r, this.color.curr.g, this.color.curr.b);
        fill(this.color.curr.r, this.color.curr.g, this.color.curr.b);
    }
}
