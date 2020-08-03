import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Luz extends Material {
  constructor(shaderManager) {
    super('Luz');
    this.shaderProgram = shaderManager.program(ShadersManager.LUZ);

  }
}

export default Luz