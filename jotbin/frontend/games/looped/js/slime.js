class Slime {
    constructor(spawnX, spawnY) {
        this.spawnX = spawnX;
        this.x = spawnX;
        this.spawnY = spawnY;
        this.y = spawnY;
        this.width = 100;
        this.height = 100;

        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.healthBarColor = "red";
        this.healthBarThickness = 5; //pixels
        this.healthBarOffest = 50; // pixels
        this.damage = 2;

        this.isJumping = true;
        this.isResetting = false;
        this.jumpDistance = 60; // pixels
        this.jumpDuration = 1250 // ms
        this.cooldown = 500 // ms
        
        this.collisionXOffset = 32;
        this.collisionYOffset = 67;
        this.collisionWidthOffset = -50;
        this.collisionHeightOffset = -64;

        this.collision = new SquareCollision(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width + this.collisionWidthOffset, this.height + this.collisionHeightOffset);
        
        this.animations = new FrameByFrame(
            debugSquare,
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            10, 10
        );
        this.animationIndex = 0;

        // random delay to start moving
        setTimeout(() => {this.isJumping = false}, Math.random() * 1000);
    }

    setX(value) {
        this.x = value;
        this.collision.x = this.x + this.collisionXOffset;
    }

    setY(value) {
        this.y = value;
        this.collision.y = this.y + this.collisionYOffset;
    }

    reset() {
        this.setX(this.spawnX);
        this.setY(this.spawnY);
        this.isResetting = true;

        setTimeout(() => {this.isResetting = false}, this.jumpDuration + Math.random() * 1000)
    }

    checkElementalCounter(projectile) {
        return true;
    }

    update() {
        // check x/y distance from player
        // set animation
        
        if (!this.isJumping && !this.isResetting && player) {
            this.isJumping = true;
            setTimeout(() => {this.isJumping = false}, this.jumpDuration + this.cooldown);

            if (Math.abs(this.collision.x - player.collision.x) > Math.abs(this.collision.y - player.collision.y)) {
                if (this.collision.x - player.collision.x > 0) {
                    this.animationIndex = 7;
                    setTimeout(() => {this.animationIndex = 3}, this.jumpDuration);
                    gsap.to(this, {x: this.x - this.jumpDistance, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                    gsap.to(this.collision, {x: this.x - this.jumpDistance + this.collisionXOffset, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                } else {
                    this.animationIndex = 5;
                    setTimeout(() => {this.animationIndex = 1}, this.jumpDuration);
                    gsap.to(this, {x: this.x + this.jumpDistance, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                    gsap.to(this.collision, {x: this.x + this.jumpDistance + this.collisionXOffset, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                }
            } else {
                if (this.collision.y - player.collision.y > 0) {
                    this.animationIndex = 4;
                    setTimeout(() => {this.animationIndex = 0}, this.jumpDuration);
                    gsap.to(this, {y: this.y - this.jumpDistance, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                    gsap.to(this.collision, {y: this.y - this.jumpDistance + this.collisionYOffset, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                } else {
                    this.animationIndex = 6;
                    setTimeout(() => {this.animationIndex = 2}, this.jumpDuration);
                    gsap.to(this, {y: this.y + this.jumpDistance, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                    gsap.to(this.collision, {y: this.y + this.jumpDistance + this.collisionYOffset, duration: this.jumpDuration / 1000, ease: "power1.inOut"});
                }
            }
        } else if (this.isResetting) {
            this.setX(this.spawnX);
            this.setY(this.spawnY);
        }

        // wall collision

        for (const levelCollision of levels[levelIndex].collision) {
                
            if (levelCollision instanceof SquareCollision) {

                if (levelCollision.hasCollided(this.collision)) {
                    let xOverlap = levelCollision.getXOverlap(this.collision);
                    let yOverlap = levelCollision.getYOverlap(this.collision);
        
                    if (Math.abs(xOverlap) < Math.abs(yOverlap)) {
                        this.setX(this.x - xOverlap);
                    } else {
                        this.setY(this.y - yOverlap);
                    }
                }
            } else if (levelCollision instanceof RightTriangleCollision) {

                if (levelCollision.hasCollided(this.collision)) {
                    let xOverlap = levelCollision.getXOverlap(this.collision);
                    let yOverlap = levelCollision.getYOverlap(this.collision);
    
                    if ( (((tile.width < 0 && this.dx < 0) ||(tile.width > 0 && this.dx > 0) || (tile.height < 0 && this.dy < 0) || (this.height > 0 && this.dy > 0)) && Math.abs(xOverlap) < Math.abs(yOverlap))  || (tile.height < 0 && this.dy > 0) || (tile.height > 0 && this.dy < 0)) {
                        this.setX(this.x - xOverlap);
                    } else {
                        this.setY(this.y - yOverlap);
                    }
                }
            }
        }

        // projectile collision
        if (player) {
            for (const projectile of player.projectiles) {
                if (projectile.collision.hasCollided(this.collision)) {
                    setTimeout(() => {player.projectiles.splice(player.projectiles.indexOf(projectile), 1)}, 0);
                    if (this.checkElementalCounter(projectile)) this.health -= projectile.damage;

                    if (this.health <= 0) {
                        setTimeout(() => {levels[levelIndex].actors.splice(levels[levelIndex].actors.indexOf(this), 1)}, 0);
                        slimesCaught++;
                    }
                }
            }
        }

        this.draw();

    }

    draw() {
        Utility.drawFrame(c, this.animations, this.animationIndex, this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier);

        if (this.health > 0) {
            c.fillStyle = this.healthBarColor;
            c.fillRect(this.collision.x * canvasMultiplier, (this.collision.y - this.healthBarOffest - this.healthBarThickness) * canvasMultiplier, this.collision.width * this.health / this.maxHealth * canvasMultiplier, this.healthBarThickness * canvasMultiplier);
        }

        if (Utility.debug) {
            c.fillStyle = "rgba(20, 100, 20, 0.2)";
            c.fillRect(this.collision.x * canvasMultiplier, this.collision.y * canvasMultiplier, this.collision.width * canvasMultiplier, this.collision.height * canvasMultiplier);
        }

    }
}

class FireSlime extends Slime {
    constructor(spawnX, spawnY) {
        super(spawnX, spawnY);
        this.animations = new FrameByFrame(
            fireSlimeSprites,
            [0, 0, 0, 0, 13.846, 12, 12.923, 12],
            [1, 1, 1, 1, 15, 13, 14, 13],
            180, 180
        );
    }

    checkElementalCounter(projectile) {
        if (projectile instanceof WaterProjectile) return true;

        return false;
    }
}

class IceSlime extends Slime {
    constructor(spawnX, spawnY) {
        super(spawnX, spawnY);
        this.animations = new FrameByFrame(
            iceSlimeSprites,
            [0, 0, 0, 0, 13.846, 12, 12.923, 12],
            [1, 1, 1, 1, 15, 13, 14, 13],
            180, 180
        );
    }

    checkElementalCounter(projectile) {
        if (projectile instanceof FireProjectile) return true;

        return false;
    }
}

class WaterSlime extends Slime {
    constructor(spawnX, spawnY) {
        super(spawnX, spawnY);
        this.animations = new FrameByFrame(
            waterSlimeSprites,
            [0, 0, 0, 0, 13.846, 12, 12.923, 12],
            [1, 1, 1, 1, 15, 13, 14, 13],
            180, 180
        );
    }

    checkElementalCounter(projectile) {
        if (projectile instanceof IceProjectile) return true;

        return false;
    }
}

class KingSlime extends Slime {
    constructor(spawnX, spawnY) {
        super(spawnX, spawnY);

        // override
        this.width = 175;
        this.height = 175;

        this.collisionXOffset = 64;
        this.collisionYOffset = 128;
        this.collisionWidthOffset = -100;
        this.collisionHeightOffset = -128;

        this.collision = new SquareCollision(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width + this.collisionWidthOffset, this.height + this.collisionHeightOffset);

        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.animations = new FrameByFrame(
            iceKingSlime,
            [0, 0, 0, 0, 13.846, 12, 12.923, 12],
            [1, 1, 1, 1, 15, 13, 14, 13],
            180, 180
        );

        this.healthBarOffest = 100; // pixels

        // new properties
        this.phase = "ice"; // "ice", "water", "fire"
    }

    checkElementalCounter(projectile) {
        if ((projectile instanceof WaterProjectile && this.phase == "fire") ||
        (projectile instanceof FireProjectile && this.phase == "ice") ||
        (projectile instanceof IceProjectile && this.phase == "water")) return true;

        return false;
    }

    update() {
        if (this.health < this.maxHealth / 3) {
            this.phase = "fire";
            this.animations.spritesheet = fireKingSlime;
        } else if (this.health < this.maxHealth * 2 / 3) {
            this.phase = "water";
            this.animations.spritesheet = waterKingSlime;
        }

        if (this.health <= 2) {
            changeScene(initEndGame)
            console.log('here')
        }

        super.update();
    }
}