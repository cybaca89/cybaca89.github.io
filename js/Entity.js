// depends on Vector3.js, Matrix4.js, Lights.js
"use strict";
function Entity() {
    this.name = '';
    this.type = 'Entity';
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);
    this.modelViewMatrix = new Matrix4();
    this.normalMatrix = new Matrix4(); // matrix3
    this.modelMatrix = new Matrix4();

    this.matrix = new Matrix4();
    this.worldMatrix = new Matrix4();
    this.visible = true;

    this.indices = new Uint8Array();
    this.vertices = new Float32Array();
    this.normals = new Float32Array();
    this.texCoords = new Float32Array();
    this.numfaces = 0;

    this.color = new Vector3();

    this.ambient = new Vector3();
    this.diffuse = new Vector3();
    this.specular = new Vector3();
    this.shine = 0.0;
};

Entity.prototype.setCube = function()
{
    this.indices = getCubeIndices();
    this.vertices = getCubeVertices();
    this.normals = getCubeNormals();
    this.texCoords = getCubeTextureCoords();
    return this;
};

Entity.prototype.setSphere = function()
{
    var sphere = new Sphere().calculate();
    this.indices = sphere.indices;
    this.vertices = sphere.vertices;
    this.normals = sphere.normals;
    this.indices = sphere.indices;
    this.numfaces = sphere.numfaces;
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
