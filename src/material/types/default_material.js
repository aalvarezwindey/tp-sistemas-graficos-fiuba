import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class DefaultMaterial extends Material {
  constructor(shaderManager) {
    super('Default Material');
    this.shaderProgram = shaderManager.program(ShadersManager.DEFAULT);

  }
}

export default DefaultMaterial