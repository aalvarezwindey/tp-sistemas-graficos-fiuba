import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class LozaAzul extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.LOZA_AZUL);
    this._initShader();
  }
}

export default LozaAzul