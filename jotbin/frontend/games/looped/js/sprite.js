class Sprite {
    constructor(image, x, y, scale = 1, hidden = false) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.hidden = hidden;
    }

    draw() {
        if (!this.hidden) {
            c.drawImage(this.image, this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier);
        }
    }
}