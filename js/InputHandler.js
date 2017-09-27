"use strict";

function InputHandler() {
    // this.pressed = 0x0;
};

InputHandler.prototype.isPressed = function(mask)
{
    return keys.pressed & mask;
};

/*
InputHandler.prototype.KeyPressed = function(ev)
{
    switch (ev.key) {
        case 'w': this.pressed |= keys.W; break;
        case 's': this.pressed |= keys.S; break;
        case 'a': this.pressed |= keys.A; break;
        case 'd': this.pressed |= keys.D; break;
        case 'k': this.pressed |= keys.K; break;
        case 'j': this.pressed |= keys.J; break;
        case 'h': this.pressed |= keys.H; break;
        case 'l': this.pressed |= keys.L; break;

        case '1': this.pressed |= keys.ONE; break;
        case '2': this.pressed |= keys.TWO; break;
        case '3': this.pressed |= keys.THREE; break;
        case '4': this.pressed |= keys.FOUR; break;
        case 'q': this.pressed ^= keys.Q; break;
        case 'e': this.pressed |= keys.E; break;
        case ' ': this.pressed |= keys.SPACE; break;
        default: break;
    }

    switch (ev.keyCode) {
        case 38: this.pressed |= keys.UP; break;
        case 37: this.pressed |= keys.LEFT; break;
        case 40: this.pressed |= keys.DOWN; break;
        case 39: this.pressed |= keys.RIGHT; break;
        default: break;
    }

};

InputHandler.prototype.KeyReleased = function(ev)
{
    switch (ev.key) {
        case 'w': this.pressed &= ~keys.W; break;
        case 's': this.pressed &= ~keys.S; break;
        case 'a': this.pressed &= ~keys.A; break;

        case 'd': this.pressed &= ~keys.D; break;
        case 'k': this.pressed &= ~keys.K; break;
        case 'j': this.pressed &= ~keys.J; break;
        case 'h': this.pressed &= ~keys.H; break;
        case 'l': this.pressed &= ~keys.L; break;

        case '1': this.pressed &= ~keys.ONE; break;
        case '2': this.pressed &= ~keys.TWO; break;
        case '3': this.pressed &= ~keys.THREE; break;
        case '4': this.pressed &= ~keys.FOUR; break;
        case 'e': this.pressed &= ~keys.E; break;
        case ' ': this.pressed &= ~keys.SPACE; break;
        default: break;
    }

    switch (ev.keyCode) {
        case 38: this.pressed &= ~keys.UP; break;
        case 37: this.pressed &= ~keys.LEFT; break;
        case 40: this.pressed &= ~keys.DOWN; break;
        case 39: this.pressed &= ~keys.RIGHT; break;
        default: break;
    }
};
*/


// (Object.freeze || Object)(Object.prototype)
// Object.seal(InputHandler) };
