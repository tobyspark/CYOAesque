/* global PIXI */

export class RectFill extends PIXI.Graphics {
    constructor(x, y, width, height, color = 0xFFFFFF) {
        super();
        
        this.shapeX = x;
        this.shapeY = y;
        this.shapeWidth = width;
        this.shapeHeight = height;
        this.color = color;
    }

    render(renderer) {
        this.clear();
        this.beginFill(this.color);
        this.drawRect(
            this.shapeX, 
            this.shapeY, 
            this.shapeWidth,
            this.shapeHeight
        );
        this.endFill();

        super.render(renderer);
    }
    
    set width(width) {
        this.shapeWidth = width;
    }
    
    get width() {
        return this.shapeWidth;
    }
}

export class CircleFill extends PIXI.Graphics {
    constructor(x, y, radius, color = 0xFFFFFF) {
        super();
        
        this.shapeX = x;
        this.shapeY = y;
        this.shapeRadius = radius;
        this.color = color;
    }

    render(renderer) {
        this.clear();
        this.beginFill(this.color);
        this.drawCircle(
            this.shapeX, 
            this.shapeY, 
            this.shapeRadius
        );
        this.endFill();

        super.render(renderer);
    }
    
    set radius(radius) {
        this.shapeRadius = radius;
    }
    
    get radius() {
        return this.shapeRadius;
    }
}