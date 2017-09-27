"use strict";
function Vector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

Vector3.prototype.toArray = function()
{
    return [ this.x, this.y, this.z ];
};

Vector3.prototype.setFromVector3 = function(v)
{
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

Vector3.prototype.set = function(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

Vector3.prototype.getCross = function(v)
{
    return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
}

Vector3.prototype.cross = function(v)
{
    this.x = this.y * v.z - this.z * v.y;
    this.y = this.z * v.x - this.x * v.z;
    this.z = this.x * v.y - this.y * v.x;
    return this;
};

Vector3.prototype.normalize = function()
{
    var rlen = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x *= rlen;
    this.y *= rlen;
    this.z *= rlen;
    return this;
};

Vector3.prototype.getLength = function()
{
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector3.prototype.dotProduct = function(v)
{
    return this.x * v.x + this.y * v.y + this.z + v.z;
};

Vector3.prototype.getProduct = function(v)
{
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
};

Vector3.prototype.multiply = function(v)
{
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
};

Vector3.prototype.multiplyScalar = function(scalar)
{
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
};

Vector3.prototype.add = function(v)
{
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
};

Vector3.prototype.sub = function(v)
{
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
};

    /*
    Vector3.prototype.multiplyMatrix4 = function(m)
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
