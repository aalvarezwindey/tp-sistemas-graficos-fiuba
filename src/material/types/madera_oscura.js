import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaOscura extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_OSCURA);

  }
}

export default MaderaOscura