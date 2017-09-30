"use strict";

/*
const POINTS = 0;
const LINES = 1;
const LINE_LOOP = 2;
const LINE_STRIP = 3;
const TRIANGLES = 4;
const TRIANGLE_STRIP = 5;
const TRIANGLE_FAN = 6;
var crossairDrawStyle = 3;
var crossairVerticesLen = 5;
var crossair_vertices = new Float32Array([
     0.0,  0.1,
     0.0, -0.1,
     0.0,  0.0,
     0.1,  0.0,
    -0.1,  0.0
]);

var crossair_colors = new Float32Array([
    0.00, 1.00, 0.30, 1.0,
    0.55, 0.28, 0.26, 1.0,
    0.22, 0.18, 0.66, 1.0,
    0.66, 0.18, 0.22, 1.0,
    1.00, 0.00, 0.00, 1.0,

]);
    */

function main()
{
    _canvas = document.getElementById('canvas');
    if (!_canvas) {
        console.log("canvas err");
        return;
    }
    _gl = WebGLUtils.setupWebGL(_canvas, {'stencil': true});
    if (!_gl) {
        console.log("context err");
        return;
    }

    _gl.enable(_gl.DEPTH_TEST);
    _gl.depthFunc(_gl.LESS);
    _gl.enable(_gl.STENCIL_TEST);
    _gl.stencilFunc(_gl.NOTEQUAL, 1, 0xff);
    _gl.stencilOp(_gl.KEEP, _gl.KEEP, _gl.REPLACE);
    _inputHandler = new InputHandler();
    SetEventListeners(_canvas);
    ResizeCallback();

    start();
};

// TODO: add crossair to center of screen
//       determine if crossair intersects object
//       add more objects
function start()
{
    var materialShader;
    var stencilShader;
    var crossairShader;

    var timer;
    var player;
    var box;
    var floor;
    var ball;
    var dirlight;
    var pointlight;

    var cubeVbo;
    var cubeNbo;
    var cubeEbo;
    var cubeTbo;
    var ballVbo;
    var ballNbo;
    var ballEbo;
    var ballTbo;
    var crossairVao;
    var crossairCao;

    var cloudTexture;
    var gitTexture;

    var numTextures = 2;
    var loadedTextures = 0;

    var crossairVerticesLen = 5;
    var crossair_vertices = new Float32Array([
         0.0,  0.1,
         0.0, -0.1,
         0.0,  0.0,
         0.1,  0.0,
        -0.1,  0.0
    ]);

    var crossair_colors = new Float32Array([
        0.00, 1.00, 0.30, 1.0,
        0.55, 0.28, 0.26, 1.0,
        0.22, 0.18, 0.66, 1.0,
        0.66, 0.18, 0.22, 1.0,
        1.00, 0.00, 0.00, 1.0,

    ]);

    var setupObjects = function()
    {
        timer = new Timer();

        player = new Player();
        player.position.setValues(-10.0, 0.0, 0.0);
        player.front.setValues(0.0, 0.0, -1.0);
        player.up.setValues(0.0, 1.0, 0.0);
        player.updateFront();
        player.setViewMatrix();
        player.lastX = _canvas.width / 2;
        player.lastY = _canvas.height / 2;

        box = new Entity().setCube().setMaterial(new Material().setGold());
        box.color.setValues(1.0, 1.0, 1.0);
        box.setRotation(0, 0, 1, 0);
        box.setPosition(0, 0, 4);

        floor = new Entity().setCube().setMaterial(new Material().setObsidian());
        floor.modelMatrix.translateValues(0, -5, 0);
        floor.modelMatrix.scaleValues(40.0, 0.001, 40.0);

        ball = new Entity().setSphere().setMaterial(new Material().setChrome());
        ball.setPosition(20.0, 0.0, 3.0);
        ball.translate();

        dirlight = new Light();
        dirlight.ambient = new Vector3(1.0, 1.0, 1.0);
        dirlight.diffuse = new Vector3(1.0, 1.0, 1.0);
        dirlight.specular = new Vector3(1.0, 1.0, 1.0);
        dirlight.direction = new Vector3(1.0, -1.0, 1.0);

        pointlight = new Light();
        pointlight.ambient = new Vector3(0.1, 1.0, 0.1);
        pointlight.diffuse = new Vector3(0.1, 1.0, 0.1);
        pointlight.specular = new Vector3(0.1, 1.0, 0.1);
        pointlight.position = new Vector3(0, 0, -2.0);
        pointlight.constant = 1.0;
        pointlight.linear = 0.09;
        pointlight.quadratic = 0.032;
    };

    var setupShaders = function()
    {
        // material shader setup
        materialShader = new Shader().createProgram(_gl, document.getElementById('material_vshader').text,
                                                         document.getElementById('material_fshader').text);
        materialShader.initMaterialProgram(_gl, materialShader.materialShader);
        materialShader.use(_gl);
        cubeVbo = _gl.createBuffer();
        cubeNbo = _gl.createBuffer();
        cubeTbo = _gl.createBuffer();
        cubeEbo = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeVbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeNbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.normals, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeTbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.texCoords, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, cubeEbo);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, box.indices, _gl.STATIC_DRAW);

        ballVbo = _gl.createBuffer();
        ballNbo = _gl.createBuffer();
        ballTbo = _gl.createBuffer();
        ballEbo = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, ballVbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, ballNbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.normals, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, ballTbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.texCoords, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ballEbo);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, ball.indices, _gl.STATIC_DRAW);

        // stencil shader setup
        stencilShader = new Shader().createProgram(_gl, document.getElementById('stencil_vshader').text,
                                                        document.getElementById('stencil_fshader').text);
        stencilShader.initStencilProgram(_gl, stencilShader.materialShader);
        stencilShader.use(_gl);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeVbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeNbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.normals, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeTbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, box.texCoords, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, cubeEbo);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, box.indices, _gl.STATIC_DRAW);

        let vtext = document.getElementById('2d_vshader').text;
        let ftext = document.getElementById('2d_fshader').text;
        crossairShader = new Shader().createProgram(_gl, vtext, ftext);
        crossairShader.init2dProgram(_gl, crossairShader.program);
        crossairShader.use(_gl);

        crossairVao = _gl.createBuffer();
        crossairCao = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, crossairVao);
        _gl.bufferData(_gl.ARRAY_BUFFER, crossair_vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, crossairCao);
        _gl.bufferData(_gl.ARRAY_BUFFER, crossair_colors, _gl.STATIC_DRAW);

    };

    var initTextures = function()
    {
        cloudTexture = new Texture(_gl, '../textures/cloud512.png', function() { textureOnload(cloudTexture.texture, cloudTexture.img); } );
        gitTexture = new Texture(_gl, '../textures/gitbg.png', function() { textureOnload(gitTexture.texture, gitTexture.img); } );
        numTextures = _numTextures;
    };



    var renderScene = function()
    {
        var perspectiveMatrix = new Matrix4().setPerspective(player.fov, _canvas.width / _canvas.height, player.near, player.far);
        var transposedInvertedModel = new Matrix4().set(box.modelMatrix);
        transposedInvertedModel.transpose();
        transposedInvertedModel.invert();

        _gl.clearColor(0.0, 0.0, 0.0, 1.0);
        _gl.enable(_gl.DEPTH_TEST);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT | _gl.STENCIL_BUFFER_BIT);

        var setLights = function()
        {
            _gl.uniform3fv(materialShader.uDirLight_ambient, dirlight.ambient.toArray());
            _gl.uniform3fv(materialShader.uDirLight_diffuse, dirlight.diffuse.toArray());
            _gl.uniform3fv(materialShader.uDirLight_specular, dirlight.specular.toArray());
            _gl.uniform3fv(materialShader.uDirLight_direction, dirlight.direction.toArray());

            _gl.uniform3fv(materialShader.uPointLight_ambient, pointlight.ambient.toArray());
            _gl.uniform3fv(materialShader.uPointLight_diffuse, pointlight.diffuse.toArray());
            _gl.uniform3fv(materialShader.uPointLight_specular, pointlight.specular.toArray());
            _gl.uniform3fv(materialShader.uPointLight_position, pointlight.position.toArray());
            _gl.uniform1f(materialShader.uPointLight_constant, pointlight.constant);
            _gl.uniform1f(materialShader.uPointLight_linear, pointlight.linear);
            _gl.uniform1f(materialShader.uPointLight_quadratic, pointlight.quadratic);
        };

        var bindCubeBuffers = function()
        {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeVbo);
            _gl.enableVertexAttribArray(materialShader.aPosition);
            _gl.vertexAttribPointer(materialShader.aPosition, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeNbo);
            _gl.enableVertexAttribArray(materialShader.aNormal);
            _gl.vertexAttribPointer(materialShader.aNormal, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeTbo);
            _gl.enableVertexAttribArray(materialShader.aTextureCoord);
            _gl.vertexAttribPointer(materialShader.aTextureCoord, 2, _gl.FLOAT, false, 8, 0);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, cubeEbo);

        };

        var renderFloor = function()
        {

            _gl.uniformMatrix4fv(materialShader.uModel, false, floor.modelMatrix.elements);
            _gl.uniformMatrix4fv(materialShader.uTransposeInverseModel, false, transposedInvertedModel.elements);
            _gl.uniform3fv(materialShader.uMaterial_ambient, floor.ambient.toArray());
            _gl.uniform3fv(materialShader.uMaterial_diffuse, floor.diffuse.toArray());
            _gl.uniform3fv(materialShader.uMaterial_specular, floor.specular.toArray());
            _gl.uniform1f(materialShader.uMaterial_shine, floor.shine);

            _gl.uniform1i(materialShader.uUseTexture, true);

            _gl.activeTexture(_gl.TEXTURE0);
            _gl.bindTexture(_gl.TEXTURE_2D, cloudTexture.texture);
            _gl.uniform1i(materialShader.uTextureSample, 0);

            _gl.drawElements(_gl.TRIANGLES, 36, _gl.UNSIGNED_BYTE, 0);
        };


        var renderBox = function()
        {
            // enable stencil
            if (box.outline) {
                _gl.stencilFunc(_gl.ALWAYS, 1, 0xff);
                _gl.stencilMask(0xff);
            }

            // set box shaderr elements and render
            _gl.uniformMatrix4fv(materialShader.uPerspective, false, perspectiveMatrix.elements);
            _gl.uniformMatrix4fv(materialShader.uView, false, player.viewMatrix.elements);
            _gl.uniformMatrix4fv(materialShader.uTransposeInverseModel, false, transposedInvertedModel.elements);
            _gl.uniform3fv(materialShader.uViewPos, player.position.toArray());

            _gl.uniformMatrix4fv(materialShader.uModel, false, box.modelMatrix.elements);
            _gl.uniform3fv(materialShader.uMaterial_ambient, box.ambient.toArray());
            _gl.uniform3fv(materialShader.uMaterial_diffuse, box.diffuse.toArray());
            _gl.uniform3fv(materialShader.uMaterial_specular, box.specular.toArray());
            _gl.uniform1f(materialShader.uMaterial_shine, box.shine);

            _gl.uniform1i(materialShader.uUseTexture, true);

            _gl.activeTexture(_gl.TEXTURE0);
            _gl.bindTexture(_gl.TEXTURE_2D, gitTexture.texture);
            _gl.uniform1i(materialShader.uTextureSample, 0);

            _gl.drawElements(_gl.TRIANGLES, 36, _gl.UNSIGNED_BYTE, 0);

            // load stencil shader
            if (box.outline) {
                _gl.stencilFunc(_gl.NOTEQUAL, 1, 0xff);
                _gl.stencilMask(0x00);
                _gl.disable(_gl.DEPTH_TEST);

                stencilShader.use(_gl);
                _gl.bindBuffer(_gl.ARRAY_BUFFER, cubeVbo);
                _gl.enableVertexAttribArray(stencilShader.aPosition);
                _gl.vertexAttribPointer(stencilShader.aPosition, 3, _gl.FLOAT, false, 12, 0);

                _gl.uniformMatrix4fv(stencilShader.uPerspective, false, perspectiveMatrix.elements);
                _gl.uniformMatrix4fv(stencilShader.uView, false, player.viewMatrix.elements);
                _gl.uniformMatrix4fv(stencilShader.uModel, false, box.modelMatrix.scaleValues(1.1, 1.1, 1.1).elements);
                _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, cubeEbo);
                _gl.drawElements(_gl.TRIANGLES, 36, _gl.UNSIGNED_BYTE, 0);

                _gl.enable(_gl.DEPTH_TEST);
            }
        };

        var renderBall = function()
        {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballVbo);
            _gl.enableVertexAttribArray(materialShader.aPosition);
            _gl.vertexAttribPointer(materialShader.aPosition, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballNbo);
            _gl.enableVertexAttribArray(materialShader.aNormal);
            _gl.vertexAttribPointer(materialShader.aNormal, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballTbo);
            _gl.enableVertexAttribArray(materialShader.aTextureCoord);
            _gl.vertexAttribPointer(materialShader.aTextureCoord, 2, _gl.FLOAT, false, 8, 0);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ballEbo);

            transposedInvertedModel.transpose();
            transposedInvertedModel.invert();
            _gl.uniformMatrix4fv(materialShader.uTransposeInverseModel, false, transposedInvertedModel.elements);

            _gl.uniformMatrix4fv(materialShader.uModel, false, ball.modelMatrix.elements);
            _gl.uniform3fv(materialShader.uMaterial_ambient, ball.ambient.toArray());
            _gl.uniform3fv(materialShader.uMaterial_diffuse, ball.diffuse.toArray());
            _gl.uniform3fv(materialShader.uMaterial_specular, ball.specular.toArray());
            _gl.uniform1f(materialShader.uMaterial_shine, ball.shine);
            _gl.uniform1i(materialShader.uUseTexture, false);

            _gl.drawElements(_gl.TRIANGLES, ball.indices.length, _gl.UNSIGNED_BYTE, 0);
        };

        var renderCrossair = function()
        {
            crossairShader.use(_gl);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, crossairVao);
            _gl.enableVertexAttribArray(crossairShader.aPosition);
            _gl.vertexAttribPointer(crossairShader.aPosition, 2, _gl.FLOAT, false, 0, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, crossairCao);
            _gl.enableVertexAttribArray(crossairShader.aColor);
            _gl.vertexAttribPointer(crossairShader.aColor, 4, _gl.FLOAT, false, 0, 0);
            // _gl.drawArrays(_gl.TRIANGLES, 0, crossairVerticesLen);
            _gl.drawArrays(_gl.LINE_STRIP, 0, crossairVerticesLen);
        };

        renderCrossair();
        materialShader.use(_gl);
        _gl.stencilMask(0x00);
        setLights();

        renderBall();
        bindCubeBuffers();
        renderFloor();
        renderBox();

    }

    var toggleTime = 0;
    var loop = function ()
    {
        timer.tick();
        player.handleEvents();

        box.angle += 0.1;
        box.debugAnimate();

        if (Math.abs(toggleTime - timer.totalTime) > 0.1) {
            if (isPressed(KEY_E)) {
                toggleTime = timer.totalTime;
                box.outline = ~box.outline;
            }
            if (isPressed(MOUSE_CLICK)) {
                toggleTime = timer.totalTime;
                player.setControlType(MOUSE_CONTROL);
            }
            if (isPressed(KEY_Q)) {
                toggleTime = timer.totalTime;
                player.setControlType(KEYBOARD_CONTROL);
            }
        }

        renderScene();

        // if (keys.pressed & keys.CLICK) {
        //     window.location = "https://www.github.com/cybaca89";
        // }

        if (!document.pointerLockElement) {
            console.log("paused");
            timer.pause();
            window.requestAnimationFrame(pauseLoop);
        } else {
            window.requestAnimationFrame(loop);
        }

    };

    var pauseLoop = function()
    {
        timer.tick();
        if (!document.pointerLockElement) {
            window.requestAnimationFrame(pauseLoop);
        } else {
            timer.resume();
            window.requestAnimationFrame(loop);
        }
    };

    var textureOnload = function(tex, img)
    {
        // _gl.activeTexture(_gl.TEXTURE0);
        _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
        _gl.bindTexture(_gl.TEXTURE_2D, tex);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, img);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
        _gl.generateMipmap(_gl.TEXTURE_2D);
        // _gl.bindTexture(_gl.TEXTURE_2D, null);

        // if (++loadedTextures < numTextures) {
        if (++loadedTextures < 2) {
            return;
        } else {
            window.requestAnimationFrame(loop);
        }
    };


    setupObjects();
    setupShaders();
    initTextures();

};
