import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Luz extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.LUZ);
    this._initShader();
  }
}

export default Luz