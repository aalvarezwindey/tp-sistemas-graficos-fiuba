import { dibujarMalla } from "./geometria.js";

class Objeto3D {
  constructor(shaderProgram) {
    this.mesh = null;
    this.modelMatrix = mat4.create();
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.rotationAngle = 0;
    this.scale = vec3.create();
    this.children = [];
    this.shaderProgram = shaderProgram;
  }

  // Private
  _updateModelMatrix() {
    this.modelMatrix = mat4.create();
    mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotationAngle, this.rotation);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.scale(this.modelMatrix, this.scale);
  }

  _isAbstractObject() {
    return !this.mesh;
  }

  _renderTriangleMesh() {
    if (this._isAbstractObject()) return;

    dibujarMalla(this.mesh, this.shaderProgram);
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