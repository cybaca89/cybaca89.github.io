"use strict";
var _gl = null;
var _canvas = null;
var _inputHandler = null;
var _defaultScreenRatio = 1920 / 1080;
// var _gamePaused = false;

/**
 * Bit masks for key presses. The 'pressed' key at is the only mutable data
 * on this file, and should only be changed by the Keydown/Keyup callback
 * functions in init.js
 */
const KEYBOARD_CONTROL = 0x01;
const MOUSE_CONTROL = 0x02;

const KEY_Q = 0x0000001;
const KEY_W = 0x0000002;
const KEY_E = 0x0000004;
const KEY_R = 0x0000008;

const KEY_T = 0x0000010;
const KEY_Y = 0x0000020;
const KEY_U = 0x0000040;
const KEY_I = 0x0000080;

const KEY_O = 0x0000100;
const KEY_P = 0x0000200;
const KEY_A = 0x0000400;
const KEY_S = 0x0000800;

const KEY_D = 0x0001000;
const KEY_F = 0x0002000;
const KEY_G = 0x0004000;
const KEY_H = 0x0008000;

const KEY_J = 0x0010000;
const KEY_K = 0x0020000;
const KEY_L = 0x0040000;
const KEY_Z = 0x0080000;

const KEY_X = 0x0100000;
const KEY_C = 0x0200000;
const KEY_V = 0x0400000;
const KEY_B = 0x0800000;

const KEY_N = 0x1000000;
const KEY_M = 0x2000000;
const KEY_SHIFT = 0x4000000;
const KEY_SPACE = 0x8000000;
const MOUSE_CLICK = 0x10000000;

const KEY_ANY = ~0x0;
const KEY_WASD = 0x1c02;
const KEY_HJKL = 0x00078000;

function MouseCoord(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
};

MouseCoord.prototype.set = function(x, y)
{
    this.x = x;
    this.y = y;
    return this;
};

var _keys = Object.create({}, {
    pressed: { value: 0, writable: true },
    mouseMove: { value: false, writable: true },

    movement: { value: new MouseCoord(), writable: false },
    lastMove: { value: new MouseCoord(), writable: false },
    lastDown: { value: new MouseCoord(), writable: false },
    lastRelease: { value: new MouseCoord(), writable: false },

}); Object.seal(_keys);

function getMouseMovement()
{
    return _keys.movement;
};

function mouseMoved()
{
    var moved = _keys.mouseMove;
    _keys.mouseMove = false;
    return moved;
};

function isPressed(KEY_MASK)
{
    return _keys.pressed & KEY_MASK;
};

function MouseClickCallback(ev)
{
    _canvas.requestPointerLock();
};

// https://github.com/toji/webgl-quake3/blob/master/js/main.js#L511
function MouseMoveCallback(ev)
{
    _keys.mouseMove = true;
    _keys.movement.set(ev.movementX, ev.movementY);
    _keys.lastMove.set(ev.pageX, ev.pageY);
};

function MouseDownCallback(ev)
{
    _keys.pressed |= MOUSE_CLICK;
    _keys.lastDown.set(ev.pageX, ev.pageY);
};

function MouseReleaseCallback(ev)
{
    _keys.pressed &= ~MOUSE_CLICK;
    _keys.lastRelease.set(ev.pageX, ev.pageY);
};

function KeyDownCallback(ev)
{
    switch (ev.key) {
        case 'q': case 'Q': _keys.pressed |= KEY_Q; break;
        case 'w': case 'W': _keys.pressed |= KEY_W; break;
        case 'e': case 'E': _keys.pressed |= KEY_E; break;
        case 'a': case 'A': _keys.pressed |= KEY_A; break;
        case 's': case 'S': _keys.pressed |= KEY_S; break;
        case 'd': case 'D': _keys.pressed |= KEY_D; break;
        case 'h': case 'H': _keys.pressed |= KEY_H; break;
        case 'j': case 'J': _keys.pressed |= KEY_J; break;
        case 'k': case 'K': _keys.pressed |= KEY_K; break;
        case 'l': case 'L': _keys.pressed |= KEY_L; break;
        case 'Shift':       _keys.pressed |= KEY_SHIFT; break;
        case ' ':           _keys.pressed |= KEY_SPACE; break;
        default: break;
    }
};

function KeyUpCallback(ev)
{
    switch (ev.key) {
        case 'q': case 'Q': _keys.pressed &= ~KEY_Q; break;
        case 'w': case 'W': _keys.pressed &= ~KEY_W; break;
        case 'e': case 'E': _keys.pressed &= ~KEY_E; break;
        case 'a': case 'A': _keys.pressed &= ~KEY_A; break;
        case 's': case 'S': _keys.pressed &= ~KEY_S; break;
        case 'd': case 'D': _keys.pressed &= ~KEY_D; break;
        case 'h': case 'H': _keys.pressed &= ~KEY_H; break;
        case 'j': case 'J': _keys.pressed &= ~KEY_J; break;
        case 'k': case 'K': _keys.pressed &= ~KEY_K; break;
        case 'l': case 'L': _keys.pressed &= ~KEY_L; break;
        case 'Shift':       _keys.pressed &= ~KEY_SHIFT; break;
        case ' ':           _keys.pressed &= ~KEY_SPACE; break;
        default: break;
    }
};

function ResizeCallback(ev)
{
    var width   = window.innerWidth - 100;
    var height   = window.innerHeight - 100;
    var newRatio = width / height;

    if (newRatio > _defaultScreenRatio)
        width = height * _defaultScreenRatio;
    else
        height = width / _defaultScreenRatio;

    _gl.viewport(0, 0, width, height);
    _canvas.width = width;
    _canvas.height = height;
};


// event types: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
function SetEventListeners(canvas)
{
    canvas.addEventListener("click", MouseClickCallback, false);
    canvas.addEventListener("mousedown", MouseDownCallback, false);
    canvas.addEventListener("mouseup", MouseReleaseCallback, false);
    canvas.addEventListener("mousemove", MouseMoveCallback, false);

    window.addEventListener("keydown", KeyDownCallback, false);
    window.addEventListener("keyup", KeyUpCallback, false);
    window.addEventListener("resize", ResizeCallback, false);
};

/*
var crossairVerticesLen = 8;
var crossair_vertices = new Float32Array([
//      0.01,  0.01, // tr
//     -0.01,  0.01, // tl
//      0.01, -0.01, // br
//     -0.01, -0.01  // bl

     0.01,  0.01, // tr
     0.00,  0.01, // tl
     0.01,  0.00, // br
     0.00,  0.00,  // bl

     0.00,  0.00, // tr
    -0.01,  0.00, // tl
     0.00, -0.01, // br
    -0.01, -0.01  // bl
]);

var crossair_color = new Float32Array([
    0.0, 1.0, 0.3
]);
*/
