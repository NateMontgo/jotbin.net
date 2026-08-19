class Guard {
    constructor(spawnX, spawnY, direction) {
        this.x = spawnX;
        this.y = spawnY;
        this.width = 100;
        this.height = 100;

        this.direction = direction; // 0, 1, 2, 3
        this.path = gsap.timeline().
        set(this, {animationIndex: 4}).
        to(this, {y: 500, duration: 1.5, ease: "none"}).
        set(this, {animationIndex: 2}).
        to(this, {x: -500, duration: 7.5, ease: "none"});

        this.speed = 3; // pixels/ms
        this.isWalking = false;

        this.visionThickness = 20;
        this.visionLength = 440
        this.visionColor = "rgba(255, 255, 255, 0.2)";
        this.visionXOffset = 50;
        this.visionYOffset = 10;

        this.animations = new FrameByFrame(
            guardSprites,
            [0, 0, 5, 5, 5],
            [1, 1, 4, 4, 4],
            305, 400
        );
        this.animationIndex = 0;
        if (this.direction == 1) {
            this.animationIndex = 1;
        } else {
            this.animationIndex = 0;
        }


        switch (direction) {
            case 1:
                this.visionBox = new EventCollision(this.x + this.visionXOffset, this.y + this.visionYOffset, this.visionLength + this.visionXOffset, this.visionThickness, () => {
                    initGameOver();
                }, true);
                break;
            case 3:
                this.visionBox = new EventCollision(this.x + this.visionXOffset - this.visionLength, this.y + this.visionYOffset, this.visionLength, this.visionThickness, () => {
                    initGameOver();
                }, true);
        }

        this.path.pause();
    }

    reset() {
        this.visionBox.lastTrigger = -1;
        this.visionBox.hasBeenCalled = false;
    }

    walk() {
        if (this.isWalking) return;

        this.path.play();
        this.isWalking = true;
    }

    update() {
        if (!this.isWalking && player !== null & player.collision.hasCollided(this.visionBox))
            this.visionBox.trigger();

        if (this.isWalking) 
            this.path.play();
        
        this.draw();
    }

    draw() {
        Utility.drawFrame(c, this.animations, this.animationIndex, this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier, this.currentSprint);
        
        if (!this.isWalking) {
            c.fillStyle = this.visionColor;
            c.fillRect(this.visionBox.x * canvasMultiplier, this.visionBox.y * canvasMultiplier, this.visionBox.width * canvasMultiplier, this.visionBox.height * canvasMultiplier);    
        }
    }

}