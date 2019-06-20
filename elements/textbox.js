/* global PIXI */

import { Wipe } from './wipe.js';
import { RectFill } from './shapes.js';

export class HorizTextBox extends PIXI.Container {
    constructor(x, y, width, height, text, options={} ) {
        super();
        
        this.x = x;
        this.y = y;
        this.boxWidth = width;
        this.boxHeight = height;
        
        const margin = options.margin || 0;
        const color = options.color || 0xFFFFFF;
        const accentColor = options.accentColor || 0x000000;
        const textStyle = options.textStyle || {};
        
        this._wipe = new Wipe(0, 0, width, height, accentColor, 'leftToRight');
        this._wipe.delegate = this;
        this._wipe.onOutCallback = () => {
            this.addChildAt(
                this._text, 
                0
            );
            this.addChildAt(
                new RectFill(0, 0, margin, this.boxHeight, accentColor),
                0
            );
            this.addChildAt(
                new RectFill(0, 0, this.boxWidth, this.boxHeight, color),
                0
            );
        };
        this.addChild(this._wipe);
        
        this._text = new PIXI.Text(text, textStyle);
        this._text.anchor.set(1, 0.5);
        this._text.x = width - margin;
        this._text.y = height/2;
    }

    set transitionPos(pos) { this._wipe.transitionPos = pos; }
    get transitionPos() { return this._wipe.transitionPos; }
}

export class VertTextBox extends PIXI.Container {
    constructor(x, y, width, height, text, image, options={}) {
        super();
        
        this.x = x;
        this.y = y;
        this.boxWidth = width;
        this.boxHeight = height;
        
        const margin = options.margin || 0;
        const color = options.color || 0xFFFFFF;
        const accentColor = options.accentColor || 0x000000;
        const textStyle = options.textStyle || {};
        const style = {
            ...textStyle,
            wordWrap: true,
            wordWrapWidth: width - margin*2,
        };
        
        this._text = new PIXI.Text(text, style);
        this._text.anchor.set(0, 1);
        this._text.x = margin;
        this._text.y = height - margin;
        
        const targetH = height - this._text.height - options.margin*2;
        const targetAspect = width / targetH;
        const imageAspect = image.texture.width / image.texture.height;
        if (imageAspect > targetAspect) {
            image.width = targetH * imageAspect;
            image.height = targetH;
        } else {
            image.width = width;
            image.height = width / imageAspect;
        }
        image.x = width/2 - image.width/2;
        image.y = targetH/2 - image.height/2;
        
        const oldFilm = new PIXI.filters.OldFilmFilter( { vignettingAlpha: 0.7, vignettingBlur: 0.4 } );
        oldFilm.seed = Date.now()%100 + x;
        image.filters = [ oldFilm ];
        image.filterArea = new PIXI.Rectangle(x, y, width, targetH); // coords are world not local
        
        this._image = image;

        this._wipe = new Wipe(0, 0, width, height, accentColor, 'topToBottom');
        this._wipe.delegate = this;
        this._wipe.onOutCallback = () => {
            this.addChildAt(
                this._text, 
                0
            );
            const textBackH = this._text.height + margin*2;
            this.addChildAt(
                new RectFill(0, this.boxHeight - textBackH, this.boxWidth, textBackH, color),
                0
            );
            this.addChildAt(
                this._image,
                0
            );
            this.addChildAt(
                new RectFill(0, 0, this.boxWidth, this.boxHeight),
                0
            );
        };
        this.addChild(this._wipe);
    }

    set transitionPos(pos) { this._wipe.transitionPos = pos; }
    get transitionPos() { return this._wipe.transitionPos; }
}