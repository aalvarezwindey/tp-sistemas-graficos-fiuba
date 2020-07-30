import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Agua extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.AGUA);

  }
}

export default Agua;