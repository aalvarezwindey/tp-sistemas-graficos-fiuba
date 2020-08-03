import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class LozaAzul extends Material {
  constructor(shaderManager) {
    super('Loza Castillo', {
      ambiente: [93.0 / 255.0, 98.0 / 255.0, 154.0 / 255.0],
      difuso: [93.0 / 255.0, 98.0 / 255.0, 154.0 / 255.0]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.LOZA_AZUL);

  }
}

export default LozaAzul