"use strict";
function Player() {

    this.viewMatrix = new Matrix4();

    this.position = new Vector3();
    this.front    = new Vector3();
    this.right    = new Vector3();
    this.up       = new Vector3(0, 1, 0);
    this.worldUp  = new Vector3(0, 1, 0);

    this.yaw= 0;
    this.pitch= 0;
    this.velocity = 0.6;
    this.sensitivity = 2;
    this.mouseSensitivity = 0.2;

    this.fov = 45; //degrees
    this.far = 1000.0;
    this.near = 0.01;

    this.controlType = MOUSE_CONTROL;
};

Player.prototype.setViewMatrix = function()
{
    let target = new Vector3().set(this.position).add(this.front);
    return this.viewMatrix.setLookAt(this.position, target, this.worldUp);
};

Player.prototype.updateFront = function()
{
    var yaw = Math.PI * this.yaw / 180;
    var pitch = Math.PI * this.pitch / 180;
    this.front.setValues(Math.cos(yaw) * Math.cos(pitch), Math.sin(pitch), Math.sin(yaw) * Math.cos(pitch)).normalize();
};

Player.prototype.handleMovement = function()
{
    let vel = this.velocity;
    let dirty = false;
    if (isPressed(KEY_D)) {
        this.position.add(this.front.getCross(this.up).normalize().multiplyScalar(vel));
        dirty = true;
    }
    if (isPressed(KEY_A)) {
        this.position.sub(this.front.getCross(this.up).normalize().multiplyScalar(vel));
        dirty = true;
    }
    if (isPressed(KEY_W)) {
        var y = this.position.y;
        this.position.add(new Vector3().set(this.front).multiplyScalar(vel));
        this.position.y = y;
        dirty = true;
    }
    if (isPressed(KEY_S)) {
        var y = this.position.y;
        this.position.sub(new Vector3().set(this.front).multiplyScalar(vel));
        this.position.y = y;
        dirty = true;
    }
    if (isPressed(KEY_SPACE)) {
        this.position.y += vel;
        dirty = true;
    }
    if (isPressed(KEY_SHIFT)) {
        this.position.y -= vel;
        dirty = true;
    }

    return dirty;
};

// https://learnopengl.com/#!Getting-started/Camera
Player.prototype.mouseControlsMovement = function()
{
    var dirty = false;
    if (mouseMoved()) {
        var offsets = getMouseMovement();
        offsets.y = -offsets.y;
        this.yaw += offsets.x * this.mouseSensitivity;
        this.pitch += offsets.y * this.mouseSensitivity;

        dirty = true;

        if (this.pitch > 89.0)
            this.pitch = 89.0;
        if (this.pitch < -89.0)
            this.pitch = -89.0;

        this.updateFront();
    }

    if (this.handleMovement() || dirty) {
        this.setViewMatrix();
    };
};

Player.prototype.keyboardControlsMovement = function()
{
    var dirty = false;
    if (isPressed(KEY_L)) {
        this.yaw += 1 * this.sensitivity;
        dirty = true;
    }
    if (isPressed(KEY_H)) {
        this.yaw -= 1 * this.sensitivity;
        dirty = true;
    }
    if (isPressed(KEY_K)) {
        this.pitch += 1 * this.sensitivity;
        dirty = true;
    }
    if (isPressed(KEY_J)) {
        this.pitch -= 1 * this.sensitivity;
        dirty = true;
    }
    if (dirty) {
        if (this.pitch > 89.0)
            this.pitch = 89.0;
        if (this.pitch < -89.0)
            this.pitch = -89.0;

        this.updateFront();
    }

    if (this.handleMovement() || dirty) {
        this.setViewMatrix();
    };
};

Player.prototype.setControlType = function(type)
{
    this.controlType = type;
    switch (type) {
        case KEYBOARD_CONTROL:
            Player.prototype.handleEvents = Player.prototype.keyboardControlsMovement;
            break;
        case MOUSE_CONTROL:
            Player.prototype.handleEvents = Player.prototype.mouseControlsMovement;
            break;
        default:
            Player.prototype.handleEvents = Player.prototype.mouseControlsMovement;
            this.controlType = MOUSE_CONTROL;
            break;
    }
};

Player.prototype.handleEvents = Player.prototype.mouseControlsMovement;
