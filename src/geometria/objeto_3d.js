class Objeto3D {
  constructor(params = { geometry: null, material: null, glContext: gl }) {
    const { geometry, material, glContext } = params;
    this.modelMatrix = mat4.create();
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.rotationAngle = 0;
    this.scale = vec3.fromValues(1, 1, 1);
    this.children = [];
    this.material = material;
    this.geometry = geometry;
    this.gl = glContext;
  }

  // Private
  _updateModelMatrix() {
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle, this.rotation);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }

  _isAbstractObject() {
    return !this.geometry;
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
    this._updateModelMatrix();

    const matrix = mat4.create();
    mat4.multiply(matrix, parentMatrix, this.modelMatrix);

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