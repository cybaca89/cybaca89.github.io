"use strict";

var _numTextures = 0;
var _loadedTextures = 0;
var _allTexturesLoaded = false;

function Texture(gl, src, onloadFunc) {
    this.texture =  gl.createTexture();
    if (!this.texture) {
        console.log('Could not create new gl texture instance');
        return;
    }

    this.img = new Image();
    if (!this.img) {
        console.log('Could not create new Image instance');
        return;
    }

    this.img.src = src;
    // this.img.onload = function() { textureOnload(gl, this.texture, this.img); };
    this.img.onload = onloadFunc;
    _numTextures++;
};

/*
function textureOnload(gl, tex, img)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    if (++_loadedTextures < _numTextures) {
        return;
    } else {
        _allTexturesLoaded = true;// window.requestAnimationFrame(loop);
    }
};
*/

// Materials from: http://devernay.free.fr/cours/opengl/materials.html
// ┌─────────────┬──────────────────────────┬──────────────────────────────┬────────────────────────────────┬──────────┐
// │    Name     │         Ambient          │           Diffuse            │            Specular            │Shininess │
// └─────────────┴────────┴────────┴────────┴────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

function Material() {
    this.ambient = new Vector3();
    this.diffuse = new Vector3();
    this.specular = new Vector3();
    this.shine = 0.0;
    this.hasTexture = false;
    this.texture = null;
};

Material.prototype.setEmerald = function()
{
    this.ambient.setValues(0.0215, 0.1745, 0.0215);
    this.diffuse.setValues(0.07568, 0.61424, 0.07568);
    this.specular.setValues(0.633, 0.727811,0.633);
    this.shine = 0.6;
};

Material.prototype.setJade = function()
{
    this.ambient.setValues(0.135, 0.2225, 0.1575);
    this.diffuse.setValues(0.54, 0.89, 0.63);
    this.specular.setValues(0.316228, 0.316228, 0.316228);
    this.shine = 0.1;
};

Material.prototype.setObsidian = function()
{
    this.ambient.setValues(0.05375, 0.05, 0.06625);
    this.diffuse.setValues(0.18275, 0.17, 0.22525);
    this.specular.setValues(0.332741, 0.328634, 0.346435);
    this.shine = 0.3;
    return this;
};

Material.prototype.setPearl = function()
{
// pearl        0.25    0.20725 0.20725 1       0.829     0.829     0.296648  0.296648  0.296648  0.088     
};

Material.prototype.setRuby = function()
{
// ruby         0.1745  0.01175 0.01175 0.61424 0.04136   0.04136   0.727811  0.626959  0.626959  0.6       
};

Material.prototype.setTurquoise = function()
{
// turquoise    0.1     0.18725 0.1745  0.396   0.74151   0.69102   0.297254  0.30829   0.306678  0.1       
};

Material.prototype.setBrass = function()
{
// brass        0.3294120.2235290.0274510.7803920.568627  0.113725  0.992157  0.941176  0.807843  0.21794872
};

Material.prototype.setBronze = function()
{
// bronze       0.2125  0.1275  0.054   0.714   0.4284    0.18144   0.393548  0.271906  0.166721  0.2       
};

Material.prototype.setChrome = function()
{
    this.ambient.setValues(0.25, 0.25, 0.25);
    this.diffuse.setValues(0.4, 0.4, 0.4);
    this.specular.setValues(0.774597, 0.774597, 0.774597);
    this.shine = 0.6;
    return this;
};

Material.prototype.setCopper = function()
{
// copper       0.19125 0.0735  0.0225  0.7038  0.27048   0.0828    0.256777  0.137622  0.086014  0.1       
};

Material.prototype.setGold = function()
{
    this.ambient.setValues(0.24725, 0.1995, 0.0745);
    this.diffuse.setValues(0.75164, 0.60648, 0.22648);
    this.specular.setValues(0.628281, 0.555802, 0.366065);
    this.shine = 0.4;
    return this;
};

Material.prototype.setSilver = function()
{
// silver       0.19225 0.19225 0.19225 0.50754 0.50754   0.50754   0.508273  0.508273  0.508273  0.4      
};

Material.prototype.setBlackPlastic = function()
{
// black plastic0.0     0.0     0.0     0.01    0.01      0.01      0.50      0.50      0.50      .25       
};

Material.prototype.setCyanPlastic = function()
{
// cyan plastic 0.0     0.1     0.06    0.0     0.509803920.509803920.501960780.501960780.50196078.25       
};

Material.prototype.setGreenPlastic = function()
{
// green plastic0.0     0.0     0.0     0.1     0.35      0.1       0.45      0.55      0.45      .25       
};

Material.prototype.setRedPlastic = function()
{
// red plastic  0.0     0.0     0.0     0.5     0.0       0.0       0.7       0.6       0.6       .25       
};

Material.prototype.setWhitePlastic = function()
{
// white plastic0.0     0.0     0.0     0.55    0.55      0.55      0.70      0.70      0.70      .25       
};

Material.prototype.setYellowPlastic = function()
{
// yellow       0.0     0.0     0.0     0.5     0.5       0.0       0.60      0.60      0.50      .25       
// plastic                                                                                                  
};

Material.prototype.setBlackRubber = function()
{
    this.ambient.setValues(0.02, 0.02, 0.02);
    this.diffuse.setValues(0.01, 0.01, 0.01);
    this.specular.setValues(0.4, 0.4, 0.4);
    this.shine = 0.078125;
    return this;
};

Material.prototype.setCyanRubber = function()
{
// cyan rubber  0.0     0.05    0.05    0.4     0.5       0.5       0.04      0.7       0.7       .078125   
};

Material.prototype.setGreenRubber = function()
{
// green rubber 0.0     0.05    0.0     0.4     0.5       0.4       0.04      0.7       0.04      .078125   
};

Material.prototype.setRedRubber = function()
{
// red rubber   0.05    0.0     0.0     0.5     0.4       0.4       0.7       0.04      0.04      .078125   
};

Material.prototype.setWhiteRubber = function()
{
// white rubber 0.05    0.05    0.05    0.5     0.5       0.5       0.7       0.7       0.7       .078125   
};

Material.prototype.setYellowRubber = function()
{
// yellow rubber0.05    0.05    0.0     0.5     0.5       0.4       0.7       0.7       0.04      .078125   
};

Material.prototype.addTexture = function(gl, src, onloadFunc)
{
    this.hasTexture = true;
    this.texture = new Texture(gl, src, onloadFunc);
    return this;
};
