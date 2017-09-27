"use strict";

function Player() {
    this.viewMatrix = new Matrix4();
    this.position = new Vector3();
    this.front = new Vector3();
    this.right = new Vector3();
    this.up = new Vector3(0, 1, 0);
    this.worldUp = new Vector3(0, 1, 0);

    this.velocity = 0.6;
    this.sensitivity = 2;
    this.yaw= 0;
    this.pitch= 0;
    this.fov = 45;
    this.near = 0.01;
    this.far = 1000.0;
};

Player.prototype.setViewMatrix = function()
{
    var center = new Vector3().setFromVector3(this.position).add(this.front);
    return this.viewMatrix.setLookAt(this.position.x, this.position.y, this.position.z,
                         // 0, 0, 0,
                         center.x, center.y, center.z,
                         // x, y, z,
                         this.worldUp.x, this.up.y, this.up.z);
};

Player.prototype.updateFront = function()
{
    var yaw = Math.PI * this.yaw / 180;
    var pitch = Math.PI * this.pitch / 180;
    this.front.set(Math.cos(yaw) * Math.cos(pitch), Math.sin(pitch), Math.sin(yaw) * Math.cos(pitch)).normalize();
};


Player.prototype.movement = function(time)
{
    var dirty = false;
    if (keys.pressed & keys.L) {
        this.yaw += 1 * this.sensitivity;
        dirty = true;
    }
    if (keys.pressed & keys.H) {
        this.yaw -= 1 * this.sensitivity;
        dirty = true;
    }
    if (keys.pressed & keys.K) {
        this.pitch += 1 * this.sensitivity;
        dirty = true;
    }
    if (keys.pressed & keys.J) {
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

    let vel = this.velocity;
    if (keys.pressed & keys.D) { // right
        this.position.add(this.front.getCross(this.up).normalize().multiplyScalar(vel));
        dirty = true;
    }
    if (keys.pressed & keys.A) { // left
        this.position.sub(this.front.getCross(this.up).normalize().multiplyScalar(vel));
        dirty = true;
    }
    if (keys.pressed & keys.W) { // forward
        this.position.add(new Vector3().setFromVector3(this.front).multiplyScalar(vel));
        dirty = true;
    }
    if (keys.pressed & keys.S) { // backward
        this.position.sub(new Vector3().setFromVector3(this.front).multiplyScalar(vel));
        dirty = true;
    }
    if (keys.pressed & keys.SPACE) {
        this.position.y += vel;
        dirty = true;
    }
    if (keys.pressed & keys.SHIFT) {
        this.position.y -= vel;
        dirty = true;
    }

    if (dirty) {
        this.setViewMatrix();
        dirty = false;
    }
};
