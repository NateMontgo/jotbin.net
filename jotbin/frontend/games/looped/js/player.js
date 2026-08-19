class Player {
    constructor(spawnX, spawnY) {
        this.x = spawnX;
        this.y = spawnY;
        this.width = 55;
        this.height = this.width * 1.516

        this.speed = 2; // pixels per frame
        this.sprintConst = 1.75; // times faster than normal speed
        this.currentSprint = 1;
        this.dx = 0;
        this.dy = 0;

        this.projectiles = [];
        this.projectileSpeed = 10; // pixels per frame
        this.projectileXOffset = 15;
        this.projectileYOffset = 40;
        this.attackCooldown = 500; //ms
        this.prevAttackTime = -1;
        this.attackType = 0; // 0, 1, 2
        this.attacking = false;

        this.healthSprites = [zeroHeart, halfHeart, oneHeart, oneAndAHalfHeart, twoHeart, twoAndAHalfHeart, threeHeart, threeAndAHalfHeart, fourHeart, fourAndAHalfHeart, fullHeart]
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.damageCooldown = 3000; // ms
        this.cooldownActive = false;
        this.healthX = -20;
        this.healthY = -150;
        this.healthScale = 0.5;

        this.slimesX = 0;
        this.slimesY = 0;
        this.slimesFont = 14;

        this.collisionXOffset = 5;
        this.collisionYOffset = 5;
        this.collisionWidthOffset = -20;
        this.collisionHeightOffset = -5;

        this.collision = new SquareCollision(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width + this.collisionWidthOffset, this.height + this.collisionHeightOffset);

        this.animations = new FrameByFrame(
            playerSprites, 
            [0, 0, 0, 0, 5, 5, 5, 5],
            [1, 1, 1, 1, 4, 4, 4, 4],
            250, 379
        );
        this.animationIndex = 1;
    }

    setX(value) {
        this.x = value;
        this.collision.x = this.x + this.collisionXOffset;
    }

    setY(value) {
        this.y = value;
        this.collision.y = this.y + this.collisionYOffset;
    }

    update() {    
        if (!Dialog.active) {
            this.setX(this.x + this.dx * this.speed * this.currentSprint);
            this.setY(this.y + this.dy * this.speed * this.currentSprint);    
        }

        if (levelIndex > -1) {
            // level collision
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

            for (const actor of levels[levelIndex].actors) {
                if (this.cooldownActive) break;

                if (actor.damage !== undefined && actor.collision.hasCollided(this.collision)) {
                    this.cooldownActive = true;
                    setTimeout(() => {this.cooldownActive = false}, this.damageCooldown);

                    this.health -= actor.damage;
                    if (player.health <= 0) initGameOver();
                }
            }

            // event collision
            for (const event of levels[levelIndex].events) {
                if (event.hasCollided(this.collision))
                    event.trigger();
            }
        }

        for(const projectile of this.projectiles) {
            projectile.update();
        }

        if (this.attacking && Date.now() > this.prevAttackTime + this.attackCooldown) {
            this.prevAttackTime = Date.now();

            let pdx = 0;
            let pdy = 0;

            switch (this.animationIndex) {
                case 0:
                case 4:
                    pdy = -this.projectileSpeed;
                    break;
                case 1:
                case 5:
                    pdx = this.projectileSpeed;
                    break;
                case 2:
                case 6:
                    pdy = this.projectileSpeed;
                    break;
                case 3:
                case 7:
                    pdx = -this.projectileSpeed;
                    break;
            }

            switch (this.attackType) {
                case 0:
                    this.projectiles.push(new FireProjectile(this.x + this.projectileXOffset, this.y + this.projectileYOffset, pdx, pdy));
                    break;
                case 1:
                    this.projectiles.push(new IceProjectile(this.x + this.projectileXOffset, this.y + this.projectileYOffset, pdx, pdy));
                    break;
                case 2:
                    this.projectiles.push(new WaterProjectile(this.x + this.projectileXOffset, this.y + this.projectileYOffset, pdx, pdy));
                    break;
            }
        }

        if (this.health < 0) this.health = 0;

        this.draw();
    }

    draw() {
        Utility.drawFrame(c, this.animations, this.animationIndex, this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier, this.currentSprint);
        c.drawImage(this.healthSprites[this.health], this.healthX * canvasMultiplier, this.healthY * canvasMultiplier, this.healthSprites[this.health].width * canvasMultiplier * this.healthScale, this.healthSprites[this.health].height * canvasMultiplier * this.healthScale);
        
        c.fillStyle = 'white';
        c.fillRect(35, 105, 370, 50)
        c.fillStyle = "black";
        c.font = "50px times new roman";
        c.fillText("Slimes Caught: " + slimesCaught, 40, 145);
    }
}