"use strict";

function Shader()
{
    this.program = null;
};

Shader.prototype.getAttribLocation = function(gl, name)
{
    return gl.getAttribLocation(this.program, name);
};

Shader.prototype.getUniformLocation = function(gl, name)
{
    return gl.getUniformLocation(this.program, name);
};

Shader.prototype.use = function (gl)
{
    gl.useProgram(this.program);
    return this;
};

Shader.prototype.createProgram = function(gl, vshadertext, fshadertext)
{
    var vshader = gl.createShader(gl.VERTEX_SHADER);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vshader) {
        console.log('vshader creation failed');
        return;
    }
    if (!fshader) {
        console.log('fshader creation failed');
        return;
    }

    gl.shaderSource(vshader, vshadertext);
    gl.compileShader(vshader);
    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        console.log('Vshader compile error: ', gl.getShaderInfoLog(vshader));
        gl.deleteShader(vshader);
        return;
    }

    gl.shaderSource(fshader, fshadertext);
    gl.compileShader(fshader);
    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
        console.log('Fshader compile error: ', gl.getShaderInfoLog(fshader));
        gl.deleteShader(fshader);
        return;
    }

    this.program = gl.createProgram();
    if (!this.program) {
        console.log("Program instantiation error.");
        return;
    }

    gl.attachShader(this.program, vshader);
    gl.attachShader(this.program, fshader);

    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.log("Unable to link program: " + gl.getProgramInfoLog(this.program));
        gl.deleteProgram(this.program);
        gl.deleteShader(fshader);
        gl.deleteShader(vshader);
        return;
    }
    return this;
};
