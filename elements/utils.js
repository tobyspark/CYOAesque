/*eslint no-console: 0*/ // Lets you use console (for example to log something)

const transitionStates = Object.freeze({ off: 0, in: 1, out:2 });

export class TransitionState {
    constructor(delegate) {
        this._state = transitionStates['off'];
        this._transitionPos = 0;
        this._delegate = delegate;
    }
    
    set transitionPos(pos) {
        this._transitionPos = pos;
        if (pos < 0 ) { 
            if (this._state !== transitionStates.off) { 
                this._state = transitionStates.off;
                this._delegate.onOff();
            }
        } else if (pos < 0.5) {
            if (this._state !== transitionStates.in) {
                this._state = transitionStates.in;
                this._delegate.onIn();
            }
        } else if (pos < 1.0) {
            if (this._state !== transitionStates.out) { 
                this._state = transitionStates.out;
                this._delegate.onOut();
            }
        } else {
            if (this._state !== transitionStates.off) {
                this._state = transitionStates.off;
                this._delegate.onOff();
            }
        }
    }
    
    get transitionPos() {
        return this._transitionPos;
    }
}