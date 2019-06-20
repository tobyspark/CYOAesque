/* global PIXI TWEEN*/

import { TransitionState } from './utils.js';

const directionOptions = Object.freeze({ leftToRight: 0, topToBottom: 1 });
export class Wipe extends PIXI.Graphics {
    constructor(x, y, width, height, color=0x000000, direction = 'leftToRight') {
        super();
        
        this.x = x;
        this.y = y;
        this.transitionWidth = width;
        this.transitionHeight = height;
        this.color = color;
        
        this._state = new TransitionState(this);
        this._direction = directionOptions[direction];
        
        this.onOff();
    }

    set transitionPos(pos) { this._state.transitionPos = pos; }
    get transitionPos() { return this._state.transitionPos; }
    
    onOff() {
        this.visible = false;
        this._x_interpolator = _ => 0;
        this._y_interpolator = _ => 0;
        this._w_interpolator = _ => this.transitionWidth;
        this._h_interpolator = _ => this.transitionHeight;
        this._pos_normaliser = _ => 0;
        if (typeof this.onOffCallback === 'function') { this.onOffCallback(); }
    }
    
    onIn() {
        this.visible = true;
        if (this._direction === directionOptions.leftToRight) {
            this._x_interpolator = (_) => this.x;
            this._w_interpolator = TWEEN.Interpolator(0, this.transitionWidth);
        } else if (this._direction === directionOptions.topToBottom) {
            this._y_interpolator = (_) => this.y;
            this._h_interpolator = TWEEN.Interpolator(0, this.transitionHeight);
        }
        this._pos_normaliser = p => p*2;
        if (typeof this.onInCallback === 'function') { this.onInCallback(); }
    }
    
    onOut() {
        this.visible = true;
        if (this._direction === directionOptions.leftToRight) {
            this._x_interpolator = TWEEN.Interpolator(this.x, this.transitionWidth);
            this._w_interpolator = TWEEN.Interpolator(this.transitionWidth, 0);
        } else if (this._direction === directionOptions.topToBottom) {
            this._y_interpolator = TWEEN.Interpolator(this.y, this.transitionHeight);
            this._h_interpolator = TWEEN.Interpolator(this.transitionHeight, 0);
        }
        this._pos_normaliser = p => p*2 - 1;
        if (typeof this.onOutCallback === 'function') { this.onOutCallback(); }
    }

    render(renderer) {
        let d = this._pos_normaliser(this.transitionPos);
        this.clear();
        this.beginFill(this.color);
        this.drawRect(
            this._x_interpolator(d),
            this._y_interpolator(d),
            this._w_interpolator(d),
            this._h_interpolator(d)
        );
        this.endFill();

        super.render(renderer);
    }
}