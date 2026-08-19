class Level {
    constructor(playerX, playerY, backgroundImage, collision = [], actors = [], events = [], sprites = [], startup = () => {}) {
        this.playerSpawnX = playerX;
        this.playerSpawnY = playerY;
        this.backgroundImage = backgroundImage;
        this.collision = collision;
        this.actors = actors;
        this.events = events;
        this.sprites = sprites;
        this.startup = startup;
        this.firstLoad = true;

        this.copyParams = [playerX, playerY, backgroundImage, [], [], [], startup];
    }

    restart() {
        if (player !== null) {
            player.x = this.playerSpawnX;
            player.y = this.playerSpawnY;
            
            for (const actor of this.actors) {
                if (actor.reset !== undefined) actor.reset();
            }

            for (const event of this.events) {
                event.reset();
            }

            player.update();

            if (this.firstLoad == true) {
                setTimeout(this.startup, 1);
            }

            this.firstLoad = false;
        }
    }

    update() {
        this.draw();
        
        for (const actor of this.actors) {
            actor.update();
        }

        for (const sprite of this.sprites) {
            sprite.draw();
        }
    }

    draw() {
        c.drawImage(this.backgroundImage, 0, 0, this.backgroundImage.width * canvas.height / this.backgroundImage.height, canvas.height);

        if (Utility.debug) {
            c.fillStyle = "rgba(100, 100, 100, 0.2)";
            
            for (const collision of this.collision) {
                if (collision instanceof SquareCollision) {
                    c.fillRect(collision.x * canvasMultiplier, collision.y * canvasMultiplier, collision.width * canvasMultiplier, collision.height * canvasMultiplier);
                } else if (collision instanceof RightTriangleCollision) {
                    c.beginPath();
                    c.moveTo(collision.x, collision.y);
                    c.lineTo(collision.x + collision.width, collision.y);
                    c.lineTo(collision.x, collision.y + collision.height);
                    c.lineTo(collision.x, collision.y);
                    c.closePath();

                    c.fill();
                }
            }

            c.fillStyle = "rgba(0, 100, 0, 0.2)";

            for (const event of this.events) {
                c.fillRect(event.x * canvasMultiplier, event.y * canvasMultiplier, event.width * canvasMultiplier, event.height * canvasMultiplier);
            }
        }
    }
}