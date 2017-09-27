

"use strict";
function main()
{
    var program;

    var aPosition;
    var aNormal;
    var aTextureCoord;

    var uPerspective;
    var uView;
    var uModel;
    var uTextureSample;
    var uTransposeInverseModel;
    var uMaterial_ambient;
    var uMaterial_diffuse;
    var uMaterial_specular;
    var uMaterial_shine;
    var uDirLight_ambient;
    var uDirLight_diffuse;
    var uDirLight_specular;
    var uDirLight_direction;
    var uPointLight_ambient;
    var uPointLight_diffuse;
    var uPointLight_specular;
    var uPointLight_position;
    var uPointLight_constant;
    var uPointLight_linear;
    var uPointLight_quadratic;
    var uViewPos;
    var uUseTexture;

    var timer;
    var player;
    var cube;
    var floor;
    var ball;
    var dirlight;
    var pointlight;

    var vbo;
    var nbo;
    var ebo;
    var tcb;
    var ballvbo;
    var ballnbo;
    var ballebo;
    var balltcb;

    var shadowDepthMap;
    var shadowDepthMapFBO;

    var cloudTexture;
    var gitTexture;
    var cloudImg;
    var gitImg;

    var numTextures = 2;
    var loadedTextures = 0;

    /*
    var frameBuffer;
    var frameBufferTexture;

    var frameBufferTextureInit = function()
    {
        frameBuffer = _gl.createFramebuffer();
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, frameBuffer);
        frameBuffer.width = 512;
        frameBuffer.height = 512;

        frameBufferTexture = _gl.createTexture;
        _gl.bindTexture(_gl.TEXTURE_2D, frameBufferTexture);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
        _gl.generateMipmap(_gl.TEXTURE_2D);
        _gl.bindTexture(_gl.TEXTURE_2D, null);

        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGB, frameBuffer.width, frameBuffer.height, 0, _gl.RGB, _gl.UNSIGNED_BYTE, null);

        var renderBuffer = _gl.createRenderbuffer();
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderBuffer);
        _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, frameBuffer.width, frameBuffer.height);

        _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, frameBufferTexture, 0);
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderBuffer);

        _gl.bindTexture(_gl.TEXTURE_2D, null);
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    };
    */


    var init = function()
    {
        _canvas = document.getElementById('canvas');
        if (!_canvas) {
            console.log("canvas err");
            return;
        }
        _gl = WebGLUtils.setupWebGL(_canvas);
        if (!_gl) {
            console.log("context err");
            return;
        }

        _gl.enable(_gl.DEPTH_TEST);
        _inputHandler = new InputHandler();
        window.addEventListener("resize", ResizeCallback, false);
        window.addEventListener("keydown", KeyDownCallback, false);
        window.addEventListener("keyup", KeyUpCallback, false);
        window.addEventListener("mousedown", MouseClickCallback, false);
        window.addEventListener("mouseup", MouseReleaseCallback, false);
        ResizeCallback();
    };

    var setup_objects = function()
    {
        timer = new Timer();
        timer.setInterval(60);

        player = new Player();
        player.position.set(-10.0, 0.0, 0.0);
        player.front.set(0.0, 0.0, -1.0);
        player.up.set(0.0, 1.0, 0.0);
        player.updateFront();
        player.setViewMatrix();

        cube = new Entity().setCube().setMaterial(new Material().Gold());
        cube.color.set(1.0, 1.0, 1.0);
        cube.position.z = 3.0;

        floor = new Entity().setCube().setMaterial(new Material().Obsidian());
        floor.modelMatrix.translate(0, -5, 0);
        floor.modelMatrix.scale(40.0, 0.001, 40.0);

        ball = new Entity().setSphere().setMaterial(new Material().Chrome());

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

    var setup_program = function()
    {
        program = new Shader().createProgram(_gl, document.getElementById('material_vshader').text, document.getElementById('material_fshader').text);
        program.use(_gl);
        // v
        aPosition = program.getAttribLocation(_gl, 'aPosition');
        aNormal = program.getAttribLocation(_gl, 'aNormal');
        aTextureCoord = program.getAttribLocation(_gl, 'aTextureCoord');

        uPerspective = program.getUniformLocation(_gl, 'uPerspective');
        uView = program.getUniformLocation(_gl, 'uView');
        uModel = program.getUniformLocation(_gl, 'uModel');
        uTransposeInverseModel = program.getUniformLocation(_gl, 'uTransposeInverseModel');

        // f
        uTextureSample = program.getUniformLocation(_gl, 'uTextureSample');
        uMaterial_ambient = program.getUniformLocation(_gl, 'uMaterial.ambient');
        uMaterial_diffuse = program.getUniformLocation(_gl, 'uMaterial.diffuse');
        uMaterial_specular = program.getUniformLocation(_gl, 'uMaterial.specular');
        uMaterial_shine = program.getUniformLocation(_gl, 'uMaterial.shine');
        uDirLight_ambient = program.getUniformLocation(_gl, 'uDirLight.ambient');
        uDirLight_diffuse = program.getUniformLocation(_gl, 'uDirLight.diffuse');
        uDirLight_specular = program.getUniformLocation(_gl, 'uDirLight.specular');
        uDirLight_direction = program.getUniformLocation(_gl, 'uDirLight.direction');
        uPointLight_ambient = program.getUniformLocation(_gl, 'uPointLight.ambient');
        uPointLight_diffuse = program.getUniformLocation(_gl, 'uPointLight.diffuse');
        uPointLight_specular = program.getUniformLocation(_gl, 'uPointLight.specular');
        uPointLight_position = program.getUniformLocation(_gl, 'uPointLight.position');
        uPointLight_constant = program.getUniformLocation(_gl, 'uPointLight.constant');
        uPointLight_linear = program.getUniformLocation(_gl, 'uPointLight.linear');
        uPointLight_quadratic = program.getUniformLocation(_gl, 'uPointLight.quadratic');
        uViewPos = program.getUniformLocation(_gl, 'uViewPos');
        uUseTexture = program.getUniformLocation(_gl, 'uUseTexture');

        program.use(_gl);
        vbo = _gl.createBuffer();
        nbo = _gl.createBuffer();
        tcb = _gl.createBuffer();
        ebo = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, vbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, cube.vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, nbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, cube.normals, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, tcb);
        _gl.bufferData(_gl.ARRAY_BUFFER, cube.texCoords, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ebo);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, cube.indices, _gl.STATIC_DRAW);

        ballvbo = _gl.createBuffer();
        ballnbo = _gl.createBuffer();
        balltcb = _gl.createBuffer();
        ballebo = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, ballvbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.vertices, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, ballnbo);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.normals, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, balltcb);
        _gl.bufferData(_gl.ARRAY_BUFFER, ball.texCoords, _gl.STATIC_DRAW);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ballebo);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, ball.indices, _gl.STATIC_DRAW);

    };

    var makeShadowTextureFrameBuffer = function()
    {
        shadowDepthMap = _gl.createTexture();
        _gl.bindTexture(_gl.TEXTURE_2D, shadowDepthMap);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.DEPTH_COMPONENT, 512, 512, 0, _gl.DEPTH_COMPONENT, _gl.FLOAT, null);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.REPEAT);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.REPEAT);

        shadowDepthMapFBO = _gl.createFramebuffer();
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, shadowDepthMapFBO);
        _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, shadowDepthMap, 0);
        _gl.drawBuffer(_gl.NONE);
        _gl.readBuffer(_gl.NONE);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    };

    var makeCloudTexture = function()
    {
        cloudTexture = _gl.createTexture();
        cloudImg = new Image();
        cloudImg.src = '../textures/cloud512.png';
        cloudImg.onload = (function() { textureOnload(); });
    };

    var makeGitTexture = function()
    {
        gitTexture = _gl.createTexture();
        gitImg = new Image();
        gitImg.src = '../textures/gitbg.png';
        gitImg.onload = (function() { textureOnload(); });
    };

    var textureOnload = function()
    {
        if (++loadedTextures < numTextures)
            return;
        // _gl.activeTexture(_gl.TEXTURE0);
        _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
        _gl.bindTexture(_gl.TEXTURE_2D, cloudTexture);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, cloudImg);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
        _gl.generateMipmap(_gl.TEXTURE_2D);
        // _gl.bindTexture(_gl.TEXTURE_2D, null);
        _gl.bindTexture(_gl.TEXTURE_2D, gitTexture);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, gitImg);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
        _gl.generateMipmap(_gl.TEXTURE_2D);
        window.requestAnimationFrame(loop);
    };


    var render = function()
    {
        program.use(_gl);
        var perspectiveMatrix = new Matrix4().setPerspective(player.fov, _canvas.width / _canvas.height, player.near, player.far);

        var setShaderProgram = function()
        {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, vbo);
            _gl.enableVertexAttribArray(aPosition);
            _gl.vertexAttribPointer(aPosition, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, nbo);
            _gl.enableVertexAttribArray(aNormal);
            _gl.vertexAttribPointer(aNormal, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, tcb);
            _gl.enableVertexAttribArray(aTextureCoord);
            _gl.vertexAttribPointer(aTextureCoord, 2, _gl.FLOAT, false, 8, 0);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ebo);

            var transposedInvertedModel = new Matrix4().set(cube.modelMatrix);
            transposedInvertedModel.transpose();
            transposedInvertedModel.invert();
            _gl.uniformMatrix4fv(uTransposeInverseModel, false, transposedInvertedModel.elements);

            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

            _gl.uniform3fv(uDirLight_ambient, dirlight.ambient.toArray());
            _gl.uniform3fv(uDirLight_diffuse, dirlight.diffuse.toArray());
            _gl.uniform3fv(uDirLight_specular, dirlight.specular.toArray());
            _gl.uniform3fv(uDirLight_direction, dirlight.direction.toArray());

            _gl.uniform3fv(uPointLight_ambient, pointlight.ambient.toArray());
            _gl.uniform3fv(uPointLight_diffuse, pointlight.diffuse.toArray());
            _gl.uniform3fv(uPointLight_specular, pointlight.specular.toArray());
            _gl.uniform3fv(uPointLight_position, pointlight.position.toArray());
            _gl.uniform1f(uPointLight_constant, pointlight.constant);
            _gl.uniform1f(uPointLight_linear, pointlight.linear);
            _gl.uniform1f(uPointLight_quadratic, pointlight.quadratic);


        };

        var renderCube = function()
        {
            _gl.uniformMatrix4fv(uPerspective, false, perspectiveMatrix.elements);
            _gl.uniformMatrix4fv(uView, false, player.viewMatrix.elements);
            _gl.uniform3fv(uViewPos, player.position.toArray());


            _gl.uniformMatrix4fv(uModel, false, cube.modelMatrix.elements);
            _gl.uniform3fv(uMaterial_ambient, cube.ambient.toArray());
            _gl.uniform3fv(uMaterial_diffuse, cube.diffuse.toArray());
            _gl.uniform3fv(uMaterial_specular, cube.specular.toArray());
            _gl.uniform1f(uMaterial_shine, cube.shine);

            _gl.uniform1i(uUseTexture, true);

            _gl.activeTexture(_gl.TEXTURE0);
            _gl.bindTexture(_gl.TEXTURE_2D, gitTexture);
            _gl.uniform1i(uTextureSample, 0);

            _gl.drawElements(_gl.TRIANGLES, 36, _gl.UNSIGNED_BYTE, 0);
        };

        var renderFloor = function()
        {

            _gl.uniformMatrix4fv(uModel, false, floor.modelMatrix.elements);
            _gl.uniform3fv(uMaterial_ambient, floor.ambient.toArray());
            _gl.uniform3fv(uMaterial_diffuse, floor.diffuse.toArray());
            _gl.uniform3fv(uMaterial_specular, floor.specular.toArray());
            _gl.uniform1f(uMaterial_shine, floor.shine);

            _gl.uniform1i(uUseTexture, true);

            _gl.activeTexture(_gl.TEXTURE0);
            _gl.bindTexture(_gl.TEXTURE_2D, cloudTexture);
            _gl.uniform1i(uTextureSample, 0);

            _gl.drawElements(_gl.TRIANGLES, 36, _gl.UNSIGNED_BYTE, 0);
        };


        var renderBall = function()
        {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballvbo);
            _gl.enableVertexAttribArray(aPosition);
            _gl.vertexAttribPointer(aPosition, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballnbo);
            _gl.enableVertexAttribArray(aNormal);
            _gl.vertexAttribPointer(aNormal, 3, _gl.FLOAT, false, 12, 0);

            _gl.bindBuffer(_gl.ARRAY_BUFFER, ballnbo);
            _gl.enableVertexAttribArray(aTextureCoord);
            _gl.vertexAttribPointer(aTextureCoord, 2, _gl.FLOAT, false, 8, 0);

            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, ballebo);

            _gl.uniformMatrix4fv(uModel, false, ball.modelMatrix.elements);
            _gl.uniform3fv(uMaterial_ambient, ball.ambient.toArray());
            _gl.uniform3fv(uMaterial_diffuse, ball.diffuse.toArray());
            _gl.uniform3fv(uMaterial_specular, ball.specular.toArray());
            _gl.uniform1f(uMaterial_shine, ball.shine);
            _gl.uniform1i(uUseTexture, true);

            _gl.drawElements(_gl.TRIANGLES, ball.indices.length, _gl.UNSIGNED_BYTE, 0);
        };

        setShaderProgram();
        renderCube();
        renderFloor();
        renderBall();

    }

    var initTextures = function()
    {
        makeCloudTexture();
        makeGitTexture();
        numTextures = 2;
    };

    init();
    setup_objects();
    setup_program();
    initTextures();
    // makeShadowTextureFrameBuffer();


    console.log(ball.position.x);

    var rot = 0;

    var loop = function ()
    {
        player.movement(timer.delta);
        // console.log(player.position);

        // if (ball.position.y > -4) {
            // ball.modelMatrix.translate(0.0, -0.01, 0.0);
            // console.log(ball.position.y);
        // }

        rot += 0.1;
        cube.modelMatrix.setRotate(rot, 1, 1, 0).translate(0, 0, 4);
        render();

        if (keys.pressed & keys.CLICK) {
            window.location = "https://www.github.com/cybaca89";
        }
        window.requestAnimationFrame(loop);

    };
    // window.requestAnimationFrame(loop);

};
