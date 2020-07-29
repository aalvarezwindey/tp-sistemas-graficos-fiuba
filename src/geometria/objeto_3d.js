class Objeto3D {
  constructor(params = { geometry: null, material: null, glContext: gl, id: '' }) {
    const { geometry, material, glContext, id } = params;
    this.id = id;
    this.modelMatrix = mat4.create();
    this.normalMatrix = mat4.create();
    this.parentMatrix = mat4.create();
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.children = [];
    this.material = material;
    this.geometry = geometry;

    if (this.geometry) {
      // Para llevar una referencia de quienes usan los buffers
      geometry.use();
    }

    this.gl = glContext;
    this.animaciones = [];
    this.autoUpdateModelMatrix = true;

    this._updateModelMatrix();
  }

  destroy() {
    if (this.geometry) {
      //console.log('[object_3d.js] destroying', this.geometry)
      this.geometry.destroy();
    }

    this.children.forEach(child => child.destroy());
  }

  // Private
  _updateModelMatrix() {
    if (!this.autoUpdateModelMatrix) return;

    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[0], [1, 0, 0]);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[1], [0, 1, 0]);
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[2], [0, 0, 1]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

    // Actualizamos la parent matrix de los hijos
    const matrix = mat4.create();
    mat4.multiply(matrix, this.parentMatrix, this.modelMatrix);

    // Update normal matrix
    mat4.invert(this.normalMatrix, matrix);
    mat4.transpose(this.normalMatrix, this.normalMatrix);

    this.children.forEach(child => child.setParentMatrix(matrix));
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
    let matrix;
    this.parentMatrix = parentMatrix;

    // Ejecutamos las animaciones
    this.animaciones.forEach(animacion => animacion(this));

    matrix = mat4.create();
    mat4.multiply(matrix, this.parentMatrix, this.modelMatrix);

    // TODO: check normal matrix
    this._renderTriangleMesh(matrix, this.normalMatrix);

    this.children.forEach(child => child.render(matrix));
  }

  setGeometry(geometry) {
    this.geometry = geometry;

    if (this.geometry) {
      // Para llevar una referencia de quienes usan los buffers
      geometry.use();
    }
  }

  setMaterial(material) {
    this.material = material;
  }

  getModelMatrix() {
    const matrix = mat4.create();
    mat4.multiply(matrix, this.parentMatrix, this.modelMatrix)
    return matrix;
  }

  addChild(child) {
    this.children.push(child);
    const matrix = mat4.create();
    mat4.multiply(matrix, this.parentMatrix, this.modelMatrix);
    child.setParentMatrix(matrix);
  }

  setParentMatrix(parentMatrix) {
    this.parentMatrix = parentMatrix;
    this._updateModelMatrix();
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
  }

  hasChild = child => this.children.indexOf(child) !== -1;

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

  // Agrega una funcion al arreglo de animaciones
  // las animaciones se ejecutan en cada ciclo de renderizado
  // pasandole el objeto como parametro
  setAnimacion = (callback) => {
    this.animaciones.push(callback);

    return callback;
  }

  getWorldCoordinates = () => {
    const matrix = mat4.create();
    mat4.multiply(matrix, this.parentMatrix, this.modelMatrix);
    const coordenadasDeMundo = vec4.fromValues(0, 0, 0, 1);
    vec4.transformMat4(coordenadasDeMundo, coordenadasDeMundo, matrix);
    return vec3.fromValues(...coordenadasDeMundo);
  }
}

export default Objeto3D