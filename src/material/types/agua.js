import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Agua extends Material {
  constructor(shaderManager) {
    super('Agua', {
      ambiente: [8, 8, 22],
      difuso: [13, 13, 15]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.AGUA);

  }
}

export default Agua;