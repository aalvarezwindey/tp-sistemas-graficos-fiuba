import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Rojo extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.ROJO);
    this._initShader();
  }
}

export default Rojo