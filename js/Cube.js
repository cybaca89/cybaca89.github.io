"use strict";

var getCubeVertices = function()
{
    return new Float32Array([
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,

     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,

     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,

    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0]);
};

var getCubeIndices = function()
{
    return new Uint8Array([
           0,  1,  2,  0,  2,  3 // front
        ,  4,  5,  6,  4,  6,  7 // right
        ,  8,  9, 10,  8, 10, 11 // up
        , 12, 13, 14, 12, 14, 15 // left
        , 16, 17, 18, 16, 18, 19 // down
        , 20, 21, 22, 20, 22, 23 // back
                                        ]);
};

var getCubeNormals = function()
{
    return new Float32Array([
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,

               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,

               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,

              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,

               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,

               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0
    ]);

};

var getCubeTextureCoords = function()
{
    return new Float32Array([
        1.0, 1.0, // front
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 1.0, // right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        1.0, 0.0, // up
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        1.0, 1.0,  // left
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 0.0, // down
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0, // back
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0 ]);
};


function Sphere(radius) {
    this.radius = radius || 1;
    this.vertices = new Float32Array();
    this.normals = new Float32Array();
    this.texCoords = new Float32Array();
    this.indices = new Uint8Array();
};

Sphere.prototype.calculate = function()
{
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var radius = this.radius;

    var latitudeBands = 15;
    var longitudeBands = 15;
    for (var i = 0; i <= latitudeBands; i++) {
        var theta = i * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var j = 0; j <= longitudeBands; j++) {
            var phi = j * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            var u = 1 - (j / longitudeBands);
            var v = 1 - (i / latitudeBands);

            normals.push(x);
            normals.push(y);
            normals.push(z);
            texCoords.push(u);
            texCoords.push(v);
            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);
        }
    }

    for (var i = 0; i <= latitudeBands; i++) {
        for (var j = 0; j <= longitudeBands; j++) {
            var first = (i * (longitudeBands + 1)) + j;
            var second = first + longitudeBands + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first + 1);
            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }
    }

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.texCoords = new Float32Array(texCoords);
    this.indices = new Uint8Array(indices);
    return this;
};


/*
function CubeData() {
};

Cube.prototybe.getVertexArray = function()
{
    return new Float32Array([
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,

     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,

     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,

    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0]);
};

Cube.prototype.getIndexArray = function()
{
    return new Uint8Array([
           0,  1,  2,  0,  2,  3 // front
        ,  4,  5,  6,  4,  6,  7 // right
        ,  8,  9, 10,  8, 10, 11 // up
        , 12, 13, 14, 12, 14, 15 // left
        , 16, 17, 18, 16, 18, 19 // down
        , 20, 21, 22, 20, 22, 23 // back
                                        ]);
};

Cube.prototype.getNormalsArray = function()
{
    return new Float32Array([
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,
               0.0,  0.0,  0.1,

               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,
               1.0,  0.0,  0.0,

               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,
               0.0,  1.0,  0.0,

              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,
              -1.0,  0.0,  0.0,

               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,
               0.0, -1.0,  0.0,

               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0,
               0.0,  0.0, -1.0
    ]);

};

Cube.prototype.getTextureArray = function()
{
    return new Float32Array([
        1.0, 1.0, // front
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 1.0, // right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        1.0, 0.0, // up
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        1.0, 1.0,  // left
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        0.0, 0.0, // down
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0, // back
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0 ]);
};
*/
