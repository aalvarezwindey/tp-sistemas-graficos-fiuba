import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Azul extends Material {
  constructor(shaderManager) {
    super('Azul');
    this.shaderProgram = shaderManager.program(ShadersManager.AZUL);

  }
}

export default Azul