import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaClara extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_CLARA);

  }
}

export default MaderaClara