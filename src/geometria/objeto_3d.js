class Objeto3D {
  constructor(params = { geometry: null, material: null, glContext: gl }) {
    const { geometry, material, glContext } = params;
    this.modelMatrix = mat4.create();
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.children = [];
    this.material = material;
    this.geometry = geometry;
    this.gl = glContext;

    this._updateModelMatrix();
  }

  // Private
  _updateModelMatrix() {
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[0], [1, 0, 0]);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[1], [0, 1, 0]);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[2], [0, 0, 1]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }

  _isAbstractObject() {
    return !this.geometry || !this.material;
  }

  _renderTriangleMesh(modelMatrix, normalMatrix) {
    if (this._isAbstractObject()) return;
    const { gl, geometry, material } = this;

    material.activate(geometry.buffers, modelMatrix, normalMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.buffers.index);
    gl.drawElements(gl.TRIANGLE_STRIP, geometry.buffers.index.numItems, gl.UNSIGNED_SHORT, 0);
  }

  // Public
  render(parentMatrix) {
    const { gl } = this;

    const matrix = mat4.create();
    mat4.multiply(matrix, parentMatrix, this.modelMatrix);

    // TODO: check normal matrix
    this._renderTriangleMesh(matrix, mat4.create());

    this.children.forEach(child => child.render(matrix));
  }

  setGeometry(geometry) {
    this.geometry = geometry;
  }

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    // TODO
  }

  setPosition(x, y, z) {
    this.position = vec3.fromValues(x, y, z);
    this._updateModelMatrix();
  }

  setRotation(x, y, z) {
    this.rotation = vec3.fromValues(x, y, z);
    this._updateModelMatrix();
  }

  setScale(x, y, z) {
    this.scale = vec3.fromValues(x, y, z);
    this._updateModelMatrix();
  }

}

export default Objeto3D