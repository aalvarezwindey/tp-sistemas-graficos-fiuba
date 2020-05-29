class Objeto3D {
  constructor(params = { surface: null, shaderProgram: null, glContext: gl }) {
    const { surface, shaderProgram, glContext } = params;
    this.modelMatrix = mat4.create();
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.rotationAngle = 0;
    this.scale = vec3.create();
    this.children = [];
    this.shaderProgram = shaderProgram;
    this.surface = surface;
    this.gl = glContext;
  }

  // Private
  _updateModelMatrix() {
    return;
    this.modelMatrix = mat4.create();
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle, this.rotation);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.scale(this.modelMatrix, this.scale);
  }

  _isAbstractObject() {
    return !this.surface;
  }

  _renderTriangleMesh() {
    if (this._isAbstractObject()) return;
    const { gl, surface, shaderProgram } = this;
    const { position, normal, uv, index } = surface.buffers;

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, uv.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normal.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);

    // TODO define mode
    const modo = 'edges';
    if (modo != "wireframe") {
        gl.uniform1i(shaderProgram.useLightingUniform, true);
        gl.drawElements(gl.TRIANGLE_STRIP, index.numItems, gl.UNSIGNED_SHORT, 0);
    }

    if (modo != "smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform, false);
        gl.drawElements(gl.LINE_STRIP, index.numItems, gl.UNSIGNED_SHORT, 0);
    }
  }

  // Public
  render(parentMatrix) {
    this._updateModelMatrix();

    const matrix = mat4.create();
    mat4.multiply(matrix, parentMatrix, this.modelMatrix);

    this._renderTriangleMesh();

    this.children.forEach(child => child.render(matrix));
  }

  // Recibe una malla generada con crearGeometria
  setGeometry(mesh) {
    this.mesh = mesh;
  }

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    // TODO
  }

  setPosition(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
  }

  setRotation(rotationAngle, x, y, z) {
    this.rotationAngle = rotationAngle;
    this.rotation = vec3.fromValues(x, y, z);
  }

  setScale(x, y, z) {
    this.scale = vec3.fromValues(x, y, z);
  }
}

export default Objeto3D