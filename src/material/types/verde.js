import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Verde extends Material {
  constructor(shaderManager) {
    super('Verde');
    this.shaderProgram = shaderManager.program(ShadersManager.VERDE);

  }
}

export default Verde