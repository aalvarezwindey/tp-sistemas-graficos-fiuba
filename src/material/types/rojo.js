import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Rojo extends Material {
  constructor(shaderManager) {
    super('Rojo');
    this.shaderProgram = shaderManager.program(ShadersManager.ROJO);

  }
}

export default Rojo