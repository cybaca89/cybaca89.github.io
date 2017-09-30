"use strict";
function Vector4(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
};

Vector4.prototype.toArray = function()
{
    return [ this.x, this.y, this.z, this.w ];
};

Vector4.prototype.set = function(v)
{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
};

Vector4.prototype.setValues = function(x, y, z, w)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w || 1;
    return this;
};

Vector4.prototype.getCross = function(v)
{
    return new Vector4(this.y * v.z - this.z * v.y,
                       this.z * v.x - this.x * v.z,
                       this.x * v.y - this.y * v.x);
};

Vector4.prototype.cross = function(v)
{
    this.x = this.y * v.z - this.z * v.y;
    this.y = this.z * v.x - this.x * v.z;
    this.z = this.x * v.y - this.y * v.x;
    return this;
};

Vector4.prototype.normalize = function()
{
    var rlen = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x *= rlen;
    this.y *= rlen;
    this.z *= rlen;
    return this;
};

Vector4.prototype.getLength = function()
{
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector4.prototype.dotProduct = function(v)
{
    return this.x * v.x + this.y * v.y + this.z + v.z;
};

Vector4.prototype.getProduct = function(v)
{
    return new Vector4(this.x * v.x, this.y * v.y, this.z * v.z);
};

Vector4.prototype.multiply = function(v)
{
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
};

Vector4.prototype.multiplyScalar = function(scalar)
{
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
};

Vector4.prototype.add = function(v)
{
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
};

Vector4.prototype.sub = function(v)
{
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
};

    /*
    Vector4.prototype.multiplyMatrix4 = function(m)
    {

        var e = m.elements;
        var x = v[0];
        var y = v[1];
        var z = v[2];
        */


/*
Floatv3.prototype.mul_by_Matrix4 = function(v, mat)
{
    var m = mat.elements;
    var x = v[0];
    var y = v[1];
    var z = v[2];
    v = [
          x * m[0] +
          y * m[4] +
          z * m[8] +
          m[11]

        , x * m[1] +
          y * m[5] +
          z * m[9] +
          m[12]

        , x * m[2] +
          y * m[6] +
          z * m[10] +
          m[13]
        ];
    return v;
};
*/
