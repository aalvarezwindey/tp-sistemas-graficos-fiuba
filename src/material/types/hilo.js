import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Hilo extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.HILO);
    this._initShader();
  }
}

export default Hilo