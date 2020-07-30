import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Piedra extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.PIEDRA);

  }
}

export default Piedra