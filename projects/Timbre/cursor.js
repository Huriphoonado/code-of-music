function Cursor() {
    let lerp_val = 0.05;

    this.height = {
        curr: 2,
        false: 2,
        true: 48
    };

    this.y = mouseY;

    this.color = {
        curr: {r: 202, g: 170, b: 121}
    }

    this.update = function(active=false) {
        this.updateSize(active);
        this.y = lerp(this.y, mouseY, lerp_val*2)
    }

    this.show = function(active=false) {
        this.updateColor(active);
        rect(0, this.y, width, this.height.curr);
    }

    this.updateSize = function(active=false) {
        this.height.curr = lerp(this.height.curr, this.height[active], lerp_val);

    }

    this.updateColor = function(active=false) {
        stroke(this.color.curr.r, this.color.curr.g, this.color.curr.b);
        fill(this.color.curr.r, this.color.curr.g, this.color.curr.b);
    }

    this.getPos = function() {
        return (height - this.y)
    }
}
