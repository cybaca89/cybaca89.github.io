function Light() {
    this.ambient = new Vector3();
    this.diffuse = new Vector3();
    this.specular = new Vector3();

    this.direction = new Vector3();
    this.position = new Vector3();
    this.constant = 0.0;
    this.linear = 0.0;
    this.quadratic = 0.0;
    this.alpha = 1.0;
    this.type = '';
};

/*
Light.prototype.getAmbientArray = function()
{
    return new Vector4(this.ambient.x, this.ambient.y, this.ambient.z, this.alpha);
};

Light.prototype.getDiffuseArray = function()
{
    return new Vector4(this.diffuse.x, this.diffuse.y, this.diffuse.z, this.alpha);
};

Light.prototype.getSpecularArray = function()
{
    return new Vector4(this.specular.x, this.specular.y, this.specular.z, this.alpha);
};

Light.prototype.getDirectionArray = function()
{
    return new Vector3().setValues(this.direction.x, this.direction.y, this.direction.z);
};

Light.prototype.getPositionArray = function()
{
    return new Vector3().setValues(this.direction.x, this.direction.y, this.direction.z);
};
*/
