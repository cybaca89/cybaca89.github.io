"use strict";

var _Sphere = null;

// Algorithm from: http://learningwebgl.com/blog/?p=1253
function InitSphere()
{
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var radius = 1;

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

    _Sphere = Object.create({}, {
        radius:    { value: 1, writable: false },
        vertices:  { value: new Float32Array(vertices), writable: false },
        normals:   { value: new Float32Array(normals), writable: false },
        texCoords: { value: new Float32Array(texCoords), writable: false },
        indices:   { value: new Uint8Array(indices), writable: false }
    });

    Object.seal(_Sphere);
};

InitSphere();
