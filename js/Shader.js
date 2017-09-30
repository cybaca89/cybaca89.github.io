"use strict";

function Shader()
{
    this.program = null;

    this.aPosition = null;
    this.aNormal = null;
    this.aTextureCoord = null;
    this.aColor = null;

    this.uColor = null;
    this.uPerspective = null;
    this.uView = null;
    this.uModel = null;
    this.uTextureSample = null;
    this.uTransposeInverseModel = null;
    this.uMaterial_ambient = null;
    this.uMaterial_diffuse = null;
    this.uMaterial_specular = null;
    this.uMaterial_shine = null;
    this.uDirLight_ambient = null;
    this.uDirLight_diffuse = null;
    this.uDirLight_specular = null;
    this.uDirLight_direction = null;
    this.uPointLight_ambient = null;
    this.uPointLight_diffuse = null;
    this.uPointLight_specular = null;
    this.uPointLight_position = null;
    this.uPointLight_constant = null;
    this.uPointLight_linear = null;
    this.uPointLight_quadratic = null;
    this.uViewPos = null;
    this.uUseTexture = null;
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
    // init program
    var p;
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

    p = gl.createProgram();
    if (!p) {
        console.log("Program instantiation error.");
        return;
    }

    gl.attachShader(p, vshader);
    gl.attachShader(p, fshader);

    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.log("Unable to link program: " + gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        gl.deleteShader(fshader);
        gl.deleteShader(vshader);
        return;
    }

    this.program = p;
    return this;
};

    // init shader vars
Shader.prototype.initMaterialProgram = function(gl, prog)
{
    var p = prog || this.program;

    this.aPosition = gl.getAttribLocation(p, 'aPosition');
    this.aNormal = gl.getAttribLocation(p, 'aNormal');
    this.aTextureCoord = gl.getAttribLocation(p, 'aTextureCoord');

    this.uView = gl.getUniformLocation(p, 'uView');
    this.uModel = gl.getUniformLocation(p, 'uModel');
    this.uViewPos = gl.getUniformLocation(p, 'uViewPos');
    this.uUseTexture = gl.getUniformLocation(p, 'uUseTexture');
    this.uPerspective = gl.getUniformLocation(p, 'uPerspective');
    this.uTextureSample = gl.getUniformLocation(p, 'uTextureSample');
    this.uTransposeInverseModel = gl.getUniformLocation(p, 'uTransposeInverseModel');

    this.uMaterial_ambient  = gl.getUniformLocation(p, 'uMaterial.ambient');
    this.uMaterial_diffuse  = gl.getUniformLocation(p, 'uMaterial.diffuse');
    this.uMaterial_specular = gl.getUniformLocation(p, 'uMaterial.specular');
    this.uMaterial_shine    = gl.getUniformLocation(p, 'uMaterial.shine');

    this.uDirLight_ambient   = gl.getUniformLocation(p, 'uDirLight.ambient');
    this.uDirLight_diffuse   = gl.getUniformLocation(p, 'uDirLight.diffuse');
    this.uDirLight_specular  = gl.getUniformLocation(p, 'uDirLight.specular');
    this.uDirLight_direction = gl.getUniformLocation(p, 'uDirLight.direction');

    this.uPointLight_ambient   = gl.getUniformLocation(p, 'uPointLight.ambient');
    this.uPointLight_diffuse   = gl.getUniformLocation(p, 'uPointLight.diffuse');
    this.uPointLight_specular  = gl.getUniformLocation(p, 'uPointLight.specular');
    this.uPointLight_position  = gl.getUniformLocation(p, 'uPointLight.position');
    this.uPointLight_constant  = gl.getUniformLocation(p, 'uPointLight.constant');
    this.uPointLight_linear    = gl.getUniformLocation(p, 'uPointLight.linear');
    this.uPointLight_quadratic = gl.getUniformLocation(p, 'uPointLight.quadratic');
};

Shader.prototype.initStencilProgram = function(gl, prog)
{
    var p = prog || this.program;
    this.aPosition = gl.getAttribLocation(p, 'aPosition');
    this.uView = gl.getUniformLocation(p, 'uView');
    this.uModel = gl.getUniformLocation(p, 'uModel');
    this.uPerspective = gl.getUniformLocation(p, 'uPerspective');
};

Shader.prototype.init2dProgram = function(gl, prog)
{
    var p = prog || this.program;
    this.aPosition = gl.getAttribLocation(p, 'aPosition');
    this.aColor    = gl.getAttribLocation(p, 'aColor');
    // this.uColor = gl.getUniformLocation(p, 'uColor');
};

