

var _gl = null;
var _canvas = null;
var _inputHandler = null;
/** @file header.js
 *  @author Cy Baca
 *
 *  Global constants for checking and settings that state of the program.
 */

/** Bit masks for key presses. The 'pressed' key at is the only mutable data
 *  on this file, and should only be changed by the Keydown/Keyup callback
 *  functions in init.js
 */
"use strict";
var keys = Object.create({}, {

    W:         { value: 0x00000001 },
    S:         { value: 0x00000002 },
    A:         { value: 0x00000004 },
    D:         { value: 0x00000008 },

    K:         { value: 0x00000010 },
    J:         { value: 0x00000020 },
    H:         { value: 0x00000040 },
    L:         { value: 0x00000080 },

    UP:        { value: 0x00000100 },
    LEFT:      { value: 0x00000200 },
    DOWN:      { value: 0x00000400 },
    RIGHT:     { value: 0x00000800 },

    ONE:       { value: 0x00001000 },
    TWO:       { value: 0x00002000 },
    THREE:     { value: 0x00004000 },
    FOUR:      { value: 0x00008000 },

    Q:         { value: 0x00010000 },
    E:         { value: 0x00020000 },
    SPACE:     { value: 0x00040000 },
    SHIFT:     { value: 0x00080000 },

    CLICK:     { value: 0x00100000 },
    WASD_MASK: { value: 0x0000000f },
    KJHL_MASK: { value: 0x000000f0 },
    ARROW_MASK:{ value: 0x00000f00 },
    ANY_MASK:  { value: ~0x0 },


    pressed:   { value: 0, writable: true },
    mouseX: { value: 0, writable: true },
    mouseY: { value: 0, writable: true },

}); Object.seal(keys);

/** Enum style type definitions to pass to a creator object and make new
 *  instances.
 */
var types = Object.create({}, {

    CUBE:           { value: 0x00000001 },
    SPHERE:         { value: 0x00000002 },
    LIGHT:          { value: 0x00000004 },
    TEXTURED_CUBE:  { value: 0x00000008 },

}); Object.seal(types);

/** Coefficients/constant declerations for model control and movement
 */
var coef = Object.create({}, {

    VIEW_LIMIT:    { value: Math.PI / 2 - 0.001 },
    LOOK_SCALE:    { value: Math.PI / 90 },
    WALKING_SPEED: { value: 30 },

}); Object.seal(coef);

const TEXTURE_PATH = '../textures/tex01.png';

function ResizeCallback(ev)
{
    // ratio = window.devicePixelRatio;
    // canvas.style.width, canvas.style.height are the canvas display size
    // canvas.width, canvas.height are the size of the drawing buffer
    // var canvas_view = document.getElementById('canvas_view');
    // var ratio = window.devicePixelRatio || (1920 / 1080);

    var ratio = 1920 / 1080;
    var width = window.innerWidth - 100;
    var height = window.innerHeight - 100;

    var new_ratio = width / height;
    if (new_ratio > ratio) {
        width = height * ratio;
    } else {
        height = width / ratio;
    }
    // canvas_view.style.width = width + 'px';
    // canvas_view.style.height = height + 'px';
    // canvas_view.style.marginTop = (-height / 2) + 'px';
    // canvas_view.style.marginLeft = (-width / 2) + 'px';
    // canvas_view.style.fontSize = (width / 800) + 'em';

    _gl.viewport(0, 0, width, height);
    _canvas.width = width;
    _canvas.height = height;
};

function MouseClickCallback(ev)
{
    var rect = _canvas.getBoundingClientRect();
    keys.mouseX = ev.clientX - rect.left;
    keys.mouseY = ev.clientY - rect.top;
    keys.pressed |= keys.CLICK;
    console.log(keys.mouseX, keys.mouseY);
};

function MouseReleaseCallback(ev)
{
    keys.pressed &= ~keys.CLICK;
};

function KeyDownCallback(ev)
{
    console.log(ev.key);
    switch (ev.key) {
        case 'w': keys.pressed |= keys.W; break;
        case 'W': keys.pressed |= keys.W; break;
        case 's': keys.pressed |= keys.S; break;
        case 'S': keys.pressed |= keys.S; break;
        case 'a': keys.pressed |= keys.A; break;
        case 'A': keys.pressed |= keys.A; break;
        case 'd': keys.pressed |= keys.D; break;
        case 'D': keys.pressed |= keys.D; break;
        case 'k': keys.pressed |= keys.K; break;
        case 'K': keys.pressed |= keys.K; break;
        case 'j': keys.pressed |= keys.J; break;
        case 'J': keys.pressed |= keys.J; break;
        case 'h': keys.pressed |= keys.H; break;
        case 'H': keys.pressed |= keys.H; break;
        case 'l': keys.pressed |= keys.L; break;
        case 'L': keys.pressed |= keys.L; break;

        case '1': keys.pressed |= keys.ONE; break;
        case '2': keys.pressed |= keys.TWO; break;
        case '3': keys.pressed |= keys.THREE; break;
        case '4': keys.pressed |= keys.FOUR; break;
        case 'q': keys.pressed ^= keys.Q; break;
        case 'Q': keys.pressed ^= keys.Q; break;
        case 'e': keys.pressed |= keys.E; break;
        case 'E': keys.pressed |= keys.E; break;
        case ' ': keys.pressed |= keys.SPACE; break;
        case 'Shift': keys.pressed |= keys.SHIFT; break;
        default: break;
    }

    switch (ev.keyCode) {
        case 38: keys.pressed |= keys.UP; break;
        case 37: keys.pressed |= keys.LEFT; break;
        case 40: keys.pressed |= keys.DOWN; break;
        case 39: keys.pressed |= keys.RIGHT; break;
        default: break;
    }
};

function KeyUpCallback(ev)
{
    switch (ev.key) {
        case 'w': keys.pressed &= ~keys.W; break;
        case 'W': keys.pressed &= ~keys.W; break;
        case 's': keys.pressed &= ~keys.S; break;
        case 'S': keys.pressed &= ~keys.S; break;
        case 'a': keys.pressed &= ~keys.A; break;
        case 'A': keys.pressed &= ~keys.A; break;

        case 'd': keys.pressed &= ~keys.D; break;
        case 'D': keys.pressed &= ~keys.D; break;
        case 'k': keys.pressed &= ~keys.K; break;
        case 'K': keys.pressed &= ~keys.K; break;
        case 'j': keys.pressed &= ~keys.J; break;
        case 'J': keys.pressed &= ~keys.J; break;
        case 'h': keys.pressed &= ~keys.H; break;
        case 'H': keys.pressed &= ~keys.H; break;
        case 'l': keys.pressed &= ~keys.L; break;
        case 'L': keys.pressed &= ~keys.L; break;

        case '1': keys.pressed &= ~keys.ONE; break;
        case '2': keys.pressed &= ~keys.TWO; break;
        case '3': keys.pressed &= ~keys.THREE; break;
        case '4': keys.pressed &= ~keys.FOUR; break;
        case 'e': keys.pressed &= ~keys.E; break;
        case ' ': keys.pressed &= ~keys.SPACE; break;
        case 'Shift': keys.pressed &= ~keys.SHIFT; break;
        default: break;
    }

    switch (ev.keyCode) {
        case 38: keys.pressed &= ~keys.UP; break;
        case 37: keys.pressed &= ~keys.LEFT; break;
        case 40: keys.pressed &= ~keys.DOWN; break;
        case 39: keys.pressed &= ~keys.RIGHT; break;
        default: break;
    }
};
