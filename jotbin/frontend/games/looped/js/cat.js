class Cat {
    constructor(spawnX, spawnY, direction) {
        this.x = spawnX;
        this.y = spawnY;
        this.width = 80;
        this.height = 80;

        this.direction = direction; // 0, 1, 2, 3
        setTimeout(() => {
            this.paths = [
                gsap.timeline().
                set(this, {animationIndex: 7}).
                to(this, {x: 550, duration: 1.8, ease: "none"}).
                to(levels[1].sprites[0], {x: 515, duration: 0.3, ease: "none"}).
                set(this, {animationIndex: 5}).
                to(this, {x: 700, duration: 1.5, ease: "none"}).
                set(this, {animationIndex: 2}),

                gsap.timeline().
                set(this, {animationIndex: 6}).
                to(this, {y: 125, duration: 0.5, ease: "none"}).
                set(this, {animationIndex: 7}).
                to(this, {x: 360, duration: 1, ease: "none"}).
                set(this, {animationIndex: 6}).
                to(this, {y: 520, duration: 1, ease: "none"}).
                set(this, {animationIndex: 7}).
                to(this, {x: -100, duration: 1, ease: "none"})
            ];

            for (const path of this.paths) {
                path.pause();
            }
        }, 1);
        this.speed = 3; // pixels/ms
        this.isWalking = false;


        this.animations = new FrameByFrame(
            catSprite,
            [0, 0, 0, 0, 4, 4, 4, 4],
            [1, 1, 1, 1, 2, 2, 2, 2],
            640, 640
        );
        this.animationIndex = 7;
    }

    playPath(path) {
        this.paths[path].play();

        switch (path) {
            case 1:
                setTimeout(() => {levels[1].actors[0].walk()}, 2000);
                setTimeout(() => {levels[1].actors[1].walk()}, 2000);
        }
    }

    update() {

        this.draw();
    }

    draw() {
        Utility.drawFrame(c, this.animations, this.animationIndex, this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier, this.currentSprint);
    }

}