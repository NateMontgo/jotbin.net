class Dialog {
    static active = false;
    static defaultScale = 1;

    static sequence; // images[]
    static current; // index

    static x;
    static y;
    static width;
    static height;

    static callback;

    static screenShot = new Image();

    static animationFrame = -1;

    static trigger(dialog, x, y, scale = 1, callback = () => {}) {
        if (this.active) return;

        Utility.pauseGame();

        this.active = true;

        this.sequence = dialog;
        this.current = 0;
        
        this.x = x;
        this.y = y;
        this.width = dialog[0].width * this.defaultScale * scale;
        this.height = dialog[0].height * this.defaultScale * scale;

        this.callback = callback;

        this.screenShot.src = canvas.toDataURL("image/png");
        this.animate();
    }

    static advance() {
        if (!this.active) return;

        if (this.current + 1 < this.sequence.length) {
            this.current++;
        } else {
            this.active = false;
            this.current = -1;
            this.sequence = [];

            cancelAnimationFrame(this.animationFrame);
            Utility.unpauseGame();

            this.callback();
        }
    }

    static animate() {
        Dialog.animationFrame = requestAnimationFrame(Dialog.animate);

        Dialog.update();
    }

    static update() {
        if (this.active) {
            this.draw();
        }
    }

    static draw() {
        c.drawImage(this.screenShot, 0, 0, canvas.width, canvas.height);
        c.drawImage(this.sequence[this.current], this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier);
    }
}