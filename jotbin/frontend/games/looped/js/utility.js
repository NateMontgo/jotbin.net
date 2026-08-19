class Utility {

    static debug = false;

    static paused = false;

    /**
     * Draws current frame of animation defined by an instance of the FrameByFrame class
     * 
     * @author Nathan Montgomery
     * @version 1.0.0
     * 
     * @param {CanvasRenderingContext2D} ctx         canvas context to draw the frame onto
     * @param {FrameByFrame}             obj         contains all animation data
     * @param {Number}                   animation   index of animation to draw
     * @param {Number}                   x           destination x coordinate
     * @param {Number}                   y           destination y coordinate
     * @param {Number}                   width       destination width
     * @param {Number}                   height      destination height
     * @param {Number}                   [speed = 1] speed of animation
     */
    static drawFrame(ctx, obj, animation, x, y, width, height, speed = 1) {
        // check if animation changed
        if (animation !== obj.prevAnimation) {
            obj.prevFrame = -1;
        }
    
        // fps cap
        if (Date.now() > obj.lastExecution + (1000 / (obj.animationSpeeds[animation] * speed)) ||
        obj.prevFrame === -1) {
        
        // increment frame
        if (obj.prevFrame + 1 >= obj.animationLengths[animation]) {
            obj.prevFrame = 0;
        } else {
            ++obj.prevFrame;
        }

        // update last execution
        obj.prevAnimation = animation;
        obj.lastExecution = Date.now();
        }

        // draw frame
        ctx.drawImage(obj.spritesheet,
        obj.prevFrame * obj.frameWidth, animation * obj.frameHeight, obj.frameWidth, obj.frameHeight,
        x, y, width, height);
    }

    static pauseGame() {
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
        cancelAnimationFrame(currentAnimationId);
    
        this.paused = true;
    }

    static unpauseGame() {
        if (!this.paused) return;
        this.paused = false;
    
        animateLevel();
    }
}


class FrameByFrame {

    /**
     * @param {Image}    spritesheet      image containing animations. Each row is an animation and each column is a frame of an animation. All frames must be the same width and height
     * @param {Number[]} animationSpeeds  framerate of each animation
     * @param {Number[]} animationLengths length of each animation
     * @param {Number}   frameWidth       width of frame in pixels
     * @param {Number}   frameHeight      height of frame in pixels
     */
    constructor(spritesheet, animationSpeeds, animationLengths, frameWidth, frameHeight) {
      this.spritesheet = spritesheet;
      this.prevAnimation = -1;
      this.prevFrame = -1;
      this.lastExecution = 0;
      this.animationSpeeds = animationSpeeds; // fps
      this.animationLengths = animationLengths; // frames
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;
    }
  }