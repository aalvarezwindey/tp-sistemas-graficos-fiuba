import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class LozaAzul extends Material {
  constructor(shaderManager) {
    super('Loza Castillo', {
      ambiente: [19, 19, 27],
      difuso: [9, 9, 10]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.LOZA_AZUL);

  }
}

export default LozaAzul