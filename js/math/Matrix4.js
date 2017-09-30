// Modification of cuon-matrix.js https://github.com/yukoba/WebGLBook/blob/master/lib/cuon-matrix.js
// requires Vector3.js

"use strict";
function Matrix4() {
    this.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
};

// No param or Matrix4 paramter
Matrix4.prototype.setIdentity = function()
{
    this.elements[0] = 1; this.elements[4] = 0; this.elements[8]  = 0; this.elements[12] = 0;
    this.elements[1] = 0; this.elements[5] = 1; this.elements[9]  = 0; this.elements[13] = 0;
    this.elements[2] = 0; this.elements[6] = 0; this.elements[10] = 1; this.elements[14] = 0;
    this.elements[3] = 0; this.elements[7] = 0; this.elements[11] = 0; this.elements[15] = 1;
    return this;
};

Matrix4.prototype.setInverseOf = function(m)
{
    var i, s, inv, det;

    s = m.elements;
    inv = new Float32Array(16);

    inv[ 0] =  s[ 5] * s[10] * s[15] - s[ 5] * s[11] * s[14] - s[ 9] * s[ 6] * s[15]
             + s[ 9] * s[ 7] * s[14] + s[13] * s[ 6] * s[11] - s[13] * s[ 7] * s[10];
    inv[ 1] = -s[ 1] * s[10] * s[15] + s[ 1] * s[11] * s[14] + s[ 9] * s[ 2] * s[15]
             - s[ 9] * s[ 3] * s[14] - s[13] * s[ 2] * s[11] + s[13] * s[ 3] * s[10];
    inv[ 2] =  s[ 1] * s[ 6] * s[15] - s[ 1] * s[ 7] * s[14] - s[ 5] * s[ 2] * s[15]
             + s[ 5] * s[ 3] * s[14] + s[13] * s[ 2] * s[ 7] - s[13] * s[ 3] * s[ 6];
    inv[ 3] = -s[ 1] * s[ 6] * s[11] + s[ 1] * s[ 7] * s[10] + s[ 5] * s[ 2] * s[11]
             - s[ 5] * s[ 3] * s[10] - s[ 9] * s[ 2] * s[ 7] + s[ 9] * s[ 3] * s[ 6];

    inv[ 4] = -s[ 4] * s[10] * s[15] + s[ 4] * s[11] * s[14] + s[ 8] * s[ 6] * s[15]
             - s[ 8] * s[ 7] * s[14] - s[12] * s[ 6] * s[11] + s[12] * s[ 7] * s[10];
    inv[ 5] =  s[ 0] * s[10] * s[15] - s[ 0] * s[11] * s[14] - s[ 8] * s[ 2] * s[15]
             + s[ 8] * s[ 3] * s[14] + s[12] * s[ 2] * s[11] - s[12] * s[ 3] * s[10];
    inv[ 6] = -s[ 0] * s[ 6] * s[15] + s[ 0] * s[ 7] * s[14] + s[ 4] * s[ 2] * s[15]
             - s[ 4] * s[ 3] * s[14] - s[12] * s[ 2] * s[ 7] + s[12] * s[ 3] * s[ 6];
    inv[ 7] =  s[ 0] * s[ 6] * s[11] - s[ 0] * s[ 7] * s[10] - s[ 4] * s[ 2] * s[11]
             + s[ 4] * s[ 3] * s[10] + s[ 8] * s[ 2] * s[ 7] - s[ 8] * s[ 3] * s[ 6];

    inv[ 8] =  s[ 4] * s[ 9] * s[15] - s[ 4] * s[11] * s[13] - s[ 8] * s[ 5] * s[15]
             + s[ 8] * s[ 7] * s[13] + s[12] * s[ 5] * s[11] - s[12] * s[ 7] * s[ 9];
    inv[ 9] = -s[ 0] * s[ 9] * s[15] + s[ 0] * s[11] * s[13] + s[ 8] * s[ 1] * s[15]
             - s[ 8] * s[ 3] * s[13] - s[12] * s[ 1] * s[11] + s[12] * s[ 3] * s[ 9];
    inv[10] =  s[ 0] * s[ 5] * s[15] - s[ 0] * s[ 7] * s[13] - s[ 4] * s[ 1] * s[15]
             + s[ 4] * s[ 3] * s[13] + s[12] * s[ 1] * s[ 7] - s[12] * s[ 3] * s[ 5];
    inv[11] = -s[ 0] * s[ 5] * s[11] + s[ 0] * s[ 7] * s[ 9] + s[ 4] * s[ 1] * s[11]
             - s[ 4] * s[ 3] * s[ 9] - s[ 8] * s[ 1] * s[ 7] + s[ 8] * s[ 3] * s[ 5];

    inv[12] = -s[ 4] * s[ 9] * s[14] + s[ 4] * s[10] * s[13] + s[ 8] * s[ 5] * s[14]
             - s[ 8] * s[ 6] * s[13] - s[12] * s[ 5] * s[10] + s[12] * s[ 6] * s[ 9];
    inv[13] =  s[ 0] * s[ 9] * s[14] - s[ 0] * s[10] * s[13] - s[ 8] * s[ 1] * s[14]
             + s[ 8] * s[ 2] * s[13] + s[12] * s[ 1] * s[10] - s[12] * s[ 2] * s[ 9];
    inv[14] = -s[ 0] * s[ 5] * s[14] + s[ 0] * s[ 6] * s[13] + s[ 4] * s[ 1] * s[14]
             - s[ 4] * s[ 2] * s[13] - s[12] * s[ 1] * s[ 6] + s[12] * s[ 2] * s[ 5];
    inv[15] =  s[ 0] * s[ 5] * s[10] - s[ 0] * s[ 6] * s[ 9] - s[ 4] * s[ 1] * s[10]
             + s[ 4] * s[ 2] * s[ 9] + s[ 8] * s[ 1] * s[ 6] - s[ 8] * s[ 2] * s[ 5];

    det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
    if (det === 0) {
        return this;
    }

    det = 1 / det;
    for (i = 0; i < 16; i++) {
        this.elements[i] = inv[i] * det;
    }

    return this;
};

Matrix4.prototype.invert = function()
{
    return this.setInverseOf(this);
};


Matrix4.prototype.set = function(m)
{
    this.elements[ 0] = m.elements[ 0];
    this.elements[ 1] = m.elements[ 1];
    this.elements[ 2] = m.elements[ 2];
    this.elements[ 3] = m.elements[ 3];

    this.elements[ 4] = m.elements[ 4];
    this.elements[ 5] = m.elements[ 5];
    this.elements[ 6] = m.elements[ 6];
    this.elements[ 7] = m.elements[ 7];

    this.elements[ 8] = m.elements[ 8];
    this.elements[ 9] = m.elements[ 9];
    this.elements[10] = m.elements[10];
    this.elements[11] = m.elements[11];

    this.elements[12] = m.elements[12];
    this.elements[13] = m.elements[13];
    this.elements[14] = m.elements[14];
    this.elements[15] = m.elements[15];

    return this;
};

Matrix4.prototype.multiply = function(m)
{
    var i, e, a, b, ai0, ai1, ai2, ai3;

    e = this.elements;
    a = this.elements;
    b = m.elements;

    // If e equals b, copy b to temporary matrix.
    if (e === b) {
        b = new Float32Array(16);
        for (i = 0; i < 16; ++i) {
            b[i] = e[i];
        }
    }

    for (i = 0; i < 4; i++) {
        ai0=a[i];  ai1=a[i+4];  ai2=a[i+8];  ai3=a[i+12];
        e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
        e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
        e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
        e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }

    return this;
};

Matrix4.prototype.transpose = function()
{
    var temp;

    temp = this.elements[ 1];
    this.elements[ 1] = this.elements[ 4];
    this.elements[ 4] = temp;

    temp = this.elements[ 2];
    this.elements[ 2] = this.elements[ 8];
    this.elements[ 8] = temp;

    temp = this.elements[ 3];
    this.elements[ 3] = this.elements[12];
    this.elements[12] = temp;

    temp = this.elements[ 6];
    this.elements[ 6] = this.elements[ 9];
    this.elements[ 9] = temp;

    temp = this.elements[ 7];
    this.elements[ 7] = this.elements[13];
    this.elements[13] = temp;

    temp = this.elements[11];
    this.elements[11] = this.elements[14];
    this.elements[14] = temp;

    return this;
};

// Vector parameter functions
/**
 * @param pos: instance of Vector3, position coordinates of the camera.
 * @param tar: instance of Vector3, target coordinates of the camera.
 * @param up:  instance of Vector3, orientation of the world.
 */
Matrix4.prototype.setLookAt = function(pos, tar, up)
{
    // debug
    for (let i = 0; i < 3; ++i) {
        let a = arguments[i];
        if (typeof a != 'object')    console.log("arg[" + i + "] is not of type object!!");
        if (!(a instanceof Vector3)) console.log("arg[" + i + "] is not an instance of Vector3!!");
    }

    var f = new Vector3().set(tar).sub(pos).normalize();
    var s = new Vector3().set(f).cross(up).normalize();
    var u = new Vector3().set(s).cross(f);

    this.elements[ 0] = s.x;
    this.elements[ 1] = u.x;
    this.elements[ 2] = -f.x;
    this.elements[ 3] = 0;

    this.elements[ 4] = s.y;
    this.elements[ 5] = u.y;
    this.elements[ 6] = -f.y;
    this.elements[ 7] = 0;

    this.elements[ 8] = s.z;
    this.elements[ 9] = u.z;
    this.elements[10] = -f.z;
    this.elements[11] = 0;

    this.elements[12] = 0;
    this.elements[13] = 0;
    this.elements[14] = 0;
    this.elements[15] = 1;

    // return this.translateValues(-pos.x, -pos.y, -pos.z);
    return this.translate(pos.negative());
};

Matrix4.prototype.lookAt = function(pos, tar, up)
{
    return this.multiply(new Matrix4().setLookAt(pos, tar, up));
};


Matrix4.prototype.setScale = function(v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    this.elements[ 0] = v.x;
    this.elements[ 1] = 0;
    this.elements[ 2] = 0;
    this.elements[ 3] = 0;

    this.elements[ 4] = 0;
    this.elements[ 5] = v.y;
    this.elements[ 6] = 0;
    this.elements[ 7] = 0;

    this.elements[ 8] = 0;
    this.elements[ 9] = 0;
    this.elements[10] = v.z;
    this.elements[11] = 0;

    this.elements[12] = 0;
    this.elements[13] = 0;
    this.elements[14] = 0;
    this.elements[15] = 1;
    return this;
};

Matrix4.prototype.scale = function(v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    this.elements[ 0] *= v.x;
    this.elements[ 1] *= v.x;
    this.elements[ 2] *= v.x;
    this.elements[ 3] *= v.x;
    this.elements[ 4] *= v.y;
    this.elements[ 5] *= v.y;
    this.elements[ 6] *= v.y;
    this.elements[ 7] *= v.y;
    this.elements[ 8] *= v.z;
    this.elements[ 9] *= v.z;
    this.elements[10] *= v.z;
    this.elements[11] *= v.z;
    return this;
};

Matrix4.prototype.setTranslate = function(v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    this.elements[ 0] = 1;
    this.elements[ 1] = 0;
    this.elements[ 2] = 0;
    this.elements[ 3] = 0;
    this.elements[ 4] = 0;
    this.elements[ 5] = 1;
    this.elements[ 6] = 0;
    this.elements[ 7] = 0;
    this.elements[ 8] = 0;
    this.elements[ 9] = 0;
    this.elements[10] = 1;
    this.elements[11] = 0;

    this.elements[12] = v.x;
    this.elements[13] = v.y;
    this.elements[14] = v.z;
    this.elements[15] = 1;
    return this;
};

Matrix4.prototype.translate = function(v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    this.elements[12] += this.elements[0] * v.x + this.elements[4] * v.y + this.elements[ 8] * v.z;
    this.elements[13] += this.elements[1] * v.x + this.elements[5] * v.y + this.elements[ 9] * v.z;
    this.elements[14] += this.elements[2] * v.x + this.elements[6] * v.y + this.elements[10] * v.z;
    this.elements[15] += this.elements[3] * v.x + this.elements[7] * v.y + this.elements[11] * v.z;
    return this;
};

/**
 * @param v: instance of Vector3, position coordinates of the camera.
 * @param angle: angle in of rotation in degrees
 */
Matrix4.prototype.setRotate = function(angle, v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    angle = Math.PI * angle / 180;
    var e = this.elements;
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    if (0 !== v.x && 0 === v.y && 0 === v.z) { // X axis only
        if (v.x < 0) s = -s;
        e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
        e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
        e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;

        return this;
    }

    if (0 === v.x && 0 !== v.y && 0 === v.z) { // Y axis only
        if (v.y < 0) s = -s;
        e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
        e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
        e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    if (0 === v.x && 0 === v.y && 0 !== v.z) { // Z axis only
        if (z < 0) s = -s;
        e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
        e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
        e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    var len = v.getLength();
    var x = v.x;
    var y = v.y;
    var z = v.z;
    if (len !== 1) {
        let rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
    }

    var nc = 1 - c;
    var xy = x * y;
    var xs = x * s;

    var yz = y * z;
    var ys = y * s;

    var zx = z * x;
    var zs = z * s;

    e[ 0] = x * x * nc + c;
    e[ 1] = xy * nc + zs;
    e[ 2] = zx * nc - ys;
    e[ 3] = 0;

    e[ 4] = xy * nc - zs;
    e[ 5] = y * y * nc + c;
    e[ 6] = yz * nc + xs;
    e[ 7] = 0;

    e[ 8] = zx * nc + ys;
    e[ 9] = yz * nc - xs;
    e[10] = z * z * nc + c;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    return this;
};

Matrix4.prototype.rotate = function(angle, v)
{
    if (typeof v != 'object')    console.log("arg v is not of type object!!");
    if (!(v instanceof Vector3)) console.log("arg v is not an instance of Vector3!!");

    return this.multiply(new Matrix4().setRotate(angle, v));
};

// Variable paramter functions
/**
 * near and far must be > 0
 * near cannot === far
 * aspect cannot === 0
 * sin of fov y cannot be 0
 */
Matrix4.prototype.setPerspective = function(fovy, aspect, near, far)
{
    fovy = Math.PI * fovy / 180 / 2;
    var sinfov = Math.sin(fovy);

    var dist = 1 / (far - near);
    var dir = Math.cos(fovy) / sinfov;

    this.elements[ 0] = dir / aspect;
    this.elements[ 1] = 0;
    this.elements[ 2] = 0;
    this.elements[ 3] = 0;

    this.elements[ 4] = 0;
    this.elements[ 5] = dir;
    this.elements[ 6] = 0;
    this.elements[ 7] = 0;

    this.elements[ 8] = 0;
    this.elements[ 9] = 0;
    this.elements[10] = -(far + near) * dist;
    this.elements[11] = -1;

    this.elements[12] = 0;
    this.elements[13] = 0;
    this.elements[14] = -2 * near * far * dist;
    this.elements[15] = 0;

    return this;
};

Matrix4.prototype.perspective = function(fovy, aspect, near, far)
{
    return this.multiply(new Matrix4().setPerspective(fovy, aspect, near, far));
};


Matrix4.prototype.setScaleValues = function(x, y, z)
{
    this.elements[ 0] = x;
    this.elements[ 1] = 0;
    this.elements[ 2] = 0;
    this.elements[ 3] = 0;

    this.elements[ 4] = 0;
    this.elements[ 5] = y;
    this.elements[ 6] = 0;
    this.elements[ 7] = 0;

    this.elements[ 8] = 0;
    this.elements[ 9] = 0;
    this.elements[10] = z;
    this.elements[11] = 0;

    this.elements[12] = 0;
    this.elements[13] = 0;
    this.elements[14] = 0;
    this.elements[15] = 1;
    return this;
};

Matrix4.prototype.scaleValues = function(x, y, z)
{
    this.elements[ 0] *= x;
    this.elements[ 1] *= x;
    this.elements[ 2] *= x;
    this.elements[ 3] *= x;
    this.elements[ 4] *= y;
    this.elements[ 5] *= y;
    this.elements[ 6] *= y;
    this.elements[ 7] *= y;
    this.elements[ 8] *= z;
    this.elements[ 9] *= z;
    this.elements[10] *= z;
    this.elements[11] *= z;
    return this;
};

Matrix4.prototype.setTranslateValues = function(x, y, z)
{
    this.elements[ 0] = 1;
    this.elements[ 1] = 0;
    this.elements[ 2] = 0;
    this.elements[ 3] = 0;
    this.elements[ 4] = 0;
    this.elements[ 5] = 1;
    this.elements[ 6] = 0;
    this.elements[ 7] = 0;
    this.elements[ 8] = 0;
    this.elements[ 9] = 0;
    this.elements[10] = 1;
    this.elements[11] = 0;

    this.elements[12] = x;
    this.elements[13] = y;
    this.elements[14] = z;
    this.elements[15] = 1;
    return this;
};

Matrix4.prototype.translateValues = function(x, y, z)
{
    this.elements[12] += this.elements[0] * x + this.elements[4] * y + this.elements[ 8] * z;
    this.elements[13] += this.elements[1] * x + this.elements[5] * y + this.elements[ 9] * z;
    this.elements[14] += this.elements[2] * x + this.elements[6] * y + this.elements[10] * z;
    this.elements[15] += this.elements[3] * x + this.elements[7] * y + this.elements[11] * z;
    return this;
};

Matrix4.prototype.setRotateValues = function(angle, x, y, z)
{
    angle = Math.PI * angle / 180;
    var e = this.elements;
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    if (0 !== x && 0 === y && 0 === z) { // X axis only
        if (x < 0) s = -s;
        e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
        e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
        e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;

        return this;
    }

    if (0 === x && 0 !== y && 0 === z) { // Y axis only
        if (y < 0) s = -s;
        e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
        e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
        e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    if (0 === x && 0 === y && 0 !== z) { // Z axis only
        if (z < 0) s = -s;
        e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
        e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
        e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
        e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        return this;
    }

    var len = Math.sqrt(x*x + y*y + z*z);
    if (len !== 1) {
        let rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
    }

    var nc = 1 - c;
    var xy = x * y;
    var xs = x * s;
    var yz = y * z;
    var ys = y * s;
    var zx = z * x;
    var zs = z * s;

    e[ 0] = x*x*nc +  c;
    e[ 1] = xy *nc + zs;
    e[ 2] = zx *nc - ys;
    e[ 3] = 0;
    e[ 4] = xy *nc - zs;
    e[ 5] = y*y*nc +  c;
    e[ 6] = yz *nc + xs;
    e[ 7] = 0;
    e[ 8] = zx *nc + ys;
    e[ 9] = yz *nc - xs;
    e[10] = z*z*nc +  c;
    e[11] = e[12] = e[13] = e[14] = 0;
    e[15] = 1;

    return this;
};

Matrix4.prototype.rotateValues = function(angle, x, y, z)
{
    return this.multiply(new Matrix4().setRotateValues(angle, x, y, z));
};

Matrix4.prototype.setOrtho = function(left, right, bottom, top, near, far)
{
    var e, rw, rh, rd;

    if (left === right || bottom === top || near === far) {
        throw 'null frustum';
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = this.elements;

    e[0]  = 2 * rw;
    e[1]  = 0;
    e[2]  = 0;
    e[3]  = 0;

    e[4]  = 0;
    e[5]  = 2 * rh;
    e[6]  = 0;
    e[7]  = 0;

    e[8]  = 0;
    e[9]  = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
};

Matrix4.prototype.ortho = function(left, right, bottom, top, near, far)
{
    return this.multiply(new Matrix4().setOrtho(left, right, bottom, top, near, far));
};

Matrix4.prototype.setFrustum = function(left, right, bottom, top, near, far)
{
    if (left === right || top === bottom || near === far) {
        throw 'null frustum';
    }
    if (near <= 0) {
        throw 'near <= 0';
    }
    if (far <= 0) {
        throw 'far <= 0';
    }

    var rw = 1 / (right - left);
    var rh = 1 / (top - bottom);
    var rd = 1 / (far - near);

    var e = this.elements;

    e[ 0] = 2 * near * rw;
    e[ 1] = 0;
    e[ 2] = 0;
    e[ 3] = 0;

    e[ 4] = 0;
    e[ 5] = 2 * near * rh;
    e[ 6] = 0;
    e[ 7] = 0;

    e[ 8] = (right + left) * rw;
    e[ 9] = (top + bottom) * rh;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
};

Matrix4.prototype.frustum = function(left, right, bottom, top, near, far)
{
    return this.multiply(new Matrix4().setFrustum(left, right, bottom, top, near, far));
};

