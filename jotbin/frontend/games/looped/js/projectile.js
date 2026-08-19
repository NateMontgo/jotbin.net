class Projectile {
    constructor(spawnX, spawnY, dx, dy) {
        this.x = spawnX;
        this.y = spawnY;
        this.width = 20;
        this.height = 20;
        this.dx = dx;
        this.dy = dy;

        this.damage = 1;

        this.collisionXOffset = 0;
        this.collisionYOffset = 0;
        this.collisionWidthOffset = -0;
        this.collisionHeightOffset = 0;

        this.collision = new SquareCollision(this.x + this.collisionXOffset, this.y + this.collisionYOffset, this.width + this.collisionWidthOffset, this.height + this.collisionHeightOffset);
        
        this.images = [debugSquare, debugSquare, debugSquare, debugSquare];
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
        this.setX(this.x + this.dx);
        this.setY(this.y + this.dy);

        if (this.x * canvasMultiplier > canvas.width ||
            (this.x + this.width) * canvasMultiplier < 0 ||
            this.y * canvasMultiplier > canvas.height ||
            (this.y + this.height) * canvasMultiplier < 0)
        {
            setTimeout(() => {player.projectiles.splice(player.projectiles.indexOf(this), 1)}, 0);
        }

        this.draw();
    }

    draw() {
        let imgIndex = -1;

        if (this.dy < 0) {
            imgIndex = 0;
        } else if (this.dx > 0) {
            imgIndex = 1;
        } else if (this.dy > 0) {
            imgIndex = 2
        } else {
            imgIndex = 3
        }

        c.drawImage(this.images[imgIndex], this.x * canvasMultiplier, this.y * canvasMultiplier, this.width * canvasMultiplier, this.height * canvasMultiplier);
    }
}

class FireProjectile extends Projectile {
    constructor(spawnX, spawnY, dx, dy) {
        super(spawnX, spawnY, dx, dy);
        this.images = [fireProjectileUpSprite, fireProjectileRightSprite, fireProjectileDownSprite, fireProjectileLeftSprite];
    }
}

class IceProjectile extends Projectile {
    constructor(spawnX, spawnY, dx, dy) {
        super(spawnX, spawnY, dx, dy);
        this.images = [iceProjectileUpSprite, iceProjectileRightSprite, iceProjectileDownSprite, iceProjectileLeftSprite];
    }
}

class WaterProjectile extends Projectile {
    constructor(spawnX, spawnY, dx, dy) {
        super(spawnX, spawnY, dx, dy);
        this.images = [waterProjectileUpSprite, waterProjectileRightSprite, waterProjectileDownSprite, waterProjectileLeftSprite];
    }
}