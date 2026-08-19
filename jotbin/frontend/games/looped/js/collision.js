class SquareCollision {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setX(value) {
        this.x = value;
    }

    setY(value) {
        this.y = value;
    }

    setWidth(value) {
        this.width = value;
    }

    setHeight(value) {
        this.height = value;
    }

    hasCollided(squareCollider) {
        if (squareCollider.x < this.x + this.width &&
            squareCollider.x + squareCollider.width > this.x &&
            squareCollider.y < this.y + this.height &&
            squareCollider.y + squareCollider.height > this.y) {

            return true
        } else {
            return false;
        };
    }

    /**
     * 
     * @param {Number} x x coordinate of point
     * @param {Number} y y coordinate of point
     * 
     * @returns {Boolean} whether point overlaps
     */
    hasPointOverlap(x, y) {
        if (x > this.x &&
            x < this.x + this.width &&
            y > this.y &&
            y < this.y + this.width
        ) {
            return true;
        }

        return false;
    }
    

    getXOverlap(squareCollider) {
        if (!this.hasCollided(squareCollider)) return 0;

        let overlapFromLeft = squareCollider.x + squareCollider.width - this.x;
        let overlapFromRight = this.x + this.width - squareCollider.x;

        if (overlapFromRight < overlapFromLeft) {
            return -overlapFromRight;
        } else {
            return overlapFromLeft;
        }
    }

    getYOverlap(squareCollider) {
        if (!this.hasCollided(squareCollider)) return 0;

        let overlapFromTop = squareCollider.y + squareCollider.height - this.y;
        let overlapFromBottom = this.y + this.height - squareCollider.y;

        if (overlapFromBottom < overlapFromTop) {
            return -overlapFromBottom;
        } else {
            return overlapFromTop;
        }
    }
}

class RightTriangleCollision {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.slope = -height / width;
    }

    setX(value) {
        this.x = value;
    }

    setY(value) {
        this.y = value;
    }

    setWidth(value) {
        this.width = value;
        this.slope = -this.height / this.width;
    }

    setHeight(value) {
        this.height = value;
        this.slope = -this.height / this.width;
    }

    hasCollided(squareCollider) {
        let inBoundsX = false;
        let inBoundsY = false;

        // square is in bounds of triangle x
            // condition if width is positive
        if ((this.width > 0 && squareCollider.x + squareCollider.width > this.x && squareCollider.x < this.x + this.width) ||
            // condition if width is negative
            (this.width < 0 && squareCollider.x + squareCollider.width > this.x + this.width && squareCollider.x < this.x)
        ) {
            inBoundsX = true;
        }

        // square is in bounds of triangle y
            // condition if height is positive
        if ((this.height > 0 && squareCollider.y + squareCollider.height > this.y && squareCollider.y < this.y + this.height && 
            (squareCollider.y < this.y + this.height + ((squareCollider.x - this.x) * this.slope) || squareCollider.y < this.y + this.height + ((squareCollider.x + squareCollider.width - this.x) * this.slope))) ||
            // condition if height is negative
            (this.height < 0 && squareCollider.y < this.y && squareCollider.y + squareCollider.height > this.y + this.height && 
            (squareCollider.y + squareCollider.height > this.y + this.height + ((squareCollider.x - this.x) * this.slope) || squareCollider.y + squareCollider.height > this.y + this.height + ((squareCollider.x + squareCollider.width - this.x) * this.slope)))
        ) {
            inBoundsY = true;
        }

        return (inBoundsX && inBoundsY);
    }
    
    getXOverlap(squareCollider) {
        if (!this.hasCollided(squareCollider)) return 0;

        let overlapFromLeft = 0;
        let overlapFromRight = 0;

        if (this.width > 0) {
            overlapFromLeft = squareCollider.x + squareCollider.width - this.x;
            
            if (this.height > 0) {
                if (squareCollider.y < this.y) {
                    overlapFromRight = this.x + this.width - squareCollider.x;
                } else {
                    overlapFromRight = ((squareCollider.y - this.y - this.height) / this.slope) + this.x - squareCollider.x;
                }
            } else {
                if (squareCollider.y + squareCollider.height > this.y) {
                    overlapFromRight = this.x + this.width - squareCollider.x;
                } else {
                    overlapFromRight = ((squareCollider.y + squareCollider.height - this.y - this.height) / this.slope) + this.x - squareCollider.x;
                }
            }
        } else {
            overlapFromRight = this.x - squareCollider.x;

            if (this.height > 0) {
                if (squareCollider.y < this.y) {
                    overlapFromLeft = squareCollider.x + squareCollider.width - this.x - this.width;
                } else {
                    overlapFromLeft = squareCollider.x + squareCollider.width - ((squareCollider.y - this.y - this.height) / this.slope) - this.x;
                }
            } else {
                if (squareCollider.y + squareCollider.height > this.y) {
                    overlapFromLeft = squareCollider.x + squareCollider.width - this.x - this.width;
                } else {
                    overlapFromLeft = squareCollider.x + squareCollider.width - ((squareCollider.y + squareCollider.height - this.y - this.height) / this.slope) - this.x;
                }
            }
        }

        if (overlapFromLeft < overlapFromRight) {
            return overlapFromLeft;
        } else {
            return -overlapFromRight;
        }
    }

    getYOverlap(squareCollider) {
        if (!this.hasCollided(squareCollider)) return 0;

        let overlapFromBottom = 0;
        let overlapFromTop = 0;

        if (this.height > 0) {
            overlapFromBottom = squareCollider.y + squareCollider.height - this.y;
            
            if (this.width > 0) {
                if (squareCollider.x < this.x) {
                    overlapFromTop = this.y + this.height - squareCollider.y;
                } else {
                    overlapFromTop = this.y + this.height + ((squareCollider.x - this.x) * this.slope) - squareCollider.y;
                }
            } else {
                if (squareCollider.x + squareCollider.width > this.x) {
                    overlapFromTop = this.y + this.height - squareCollider.y;
                } else {
                    overlapFromTop = this.y + this.height + ((squareCollider.x + squareCollider.width - this.x) * this.slope) - squareCollider.y;
                }
            }
        } else {
            overlapFromTop = this.y - squareCollider.y;

            if (this.width > 0) {
                if (squareCollider.x < this.x) {
                    overlapFromBottom = squareCollider.y + squareCollider.height - this.y - this.height;
                } else {
                    overlapFromBottom = squareCollider.y + squareCollider.height - (this.y + this.height + ((squareCollider.x - this.x) * this.slope));
                }
            } else {
                if (squareCollider.x + squareCollider.width > this.x) {
                    overlapFromBottom = squareCollider.y + squareCollider.height - this.y - this.height;
                } else {
                    overlapFromBottom = squareCollider.y + squareCollider.height - (this.y + this.height + ((squareCollider.x + squareCollider.width - this.x) * this.slope));
                }
            }
        }

        if (overlapFromBottom < overlapFromTop) {
            return overlapFromBottom;
        } else {
            return -overlapFromTop;
        }
    }
}

class EventCollision extends SquareCollision {
    constructor(x, y, width, height, callback, singleUse = false) {
        super(x, y, width, height);
        this.callback = callback;
        this.singleUse = singleUse;
        this.hasBeenCalled = false;
        this.lastTrigger = -1;
    }

    trigger() {
        if (!this.singleUse || !this.hasBeenCalled) {
            this.hasBeenCalled = true;
            this.callback();
        }
    }

    reset() {
        this.hasBeenCalled = false;
        this.lastTrigger = -1;
    }
}