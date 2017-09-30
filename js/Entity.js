// depends on Vector3.js, Matrix4.js, Lights.js

"use strict";
function Entity() {
    this.name = '';
    this.type = 'Entity';
    this.visible = true;

    // animation
    this.modelMatrix = new Matrix4();
    this.scale    = new Vector3(1, 1, 1);
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.roationAngle = 0;

    // render
    this.color    = new Vector3();
    this.ambient  = new Vector3();
    this.diffuse  = new Vector3();
    this.specular = new Vector3();
    this.shine = 0.0;

    // gl coords
    this.indices   = null; // new Uint8Array();
    this.vertices  = null; // new Float32Array();
    this.normals   = null; // new Float32Array();
    this.texCoords = null; // new Float32Array();

    this.outline = false;

    // this.vbo = null;
    // this.vao = null;
    // this.ebo = null;
    // this.tbo = null;

};

Entity.prototype.setCube = function(name)
{
    this.name = name || '';
    this.type = 'cube';
    this.vertices = _Cube.vertices;
    this.normals = _Cube.normals;
    this.texCoords = _Cube.texCoords;
    this.indices = _Cube.indices;
    return this;
};

Entity.prototype.setSphere = function(name)
{
    this.name = name || '';
    this.type = 'sphere';
    this.vertices = _Sphere.vertices;
    this.normals = _Sphere.normals;
    this.texCoords = _Sphere.texCoords;
    this.indices = _Sphere.indices;
    return this;
};

Entity.prototype.setMaterial = function(m)
{
    this.ambient = m.ambient;
    this.diffuse = m.diffuse;
    this.specular = m.specular;
    this.shine = m.shine;
    return this;
};

Entity.prototype.setRotation = function(angle, x, y, z)
{
    this.rotation.setValues(x, y, z);
    this.angle = angle;
    return this;
};

Entity.prototype.setPosition = function(x, y, z)
{
    return this.position.setValues(x, y, z);
};

Entity.prototype.translate = function()
{
    return this.modelMatrix.translate(this.position);
};

Entity.prototype.debugAnimate = function()
{
    // rotate around y axis at this.position
    return this.modelMatrix.setTranslate(this.position).rotate(this.angle, this.rotation);
};
