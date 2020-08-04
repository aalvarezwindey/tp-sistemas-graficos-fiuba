import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaClara extends Material {
  constructor(shaderManager) {
    super('Madera Clara', {
      ambiente: [23, 19, 7],
      difuso: [2, 2, 2]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_CLARA);

  }
}

export default MaderaClara