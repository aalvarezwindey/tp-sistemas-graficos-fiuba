import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Piedra extends Material {
  constructor(shaderManager) {
    super('Piedra', {
      ambiente: [20, 15, 15],
      difuso: [5, 5, 5]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.PIEDRA);

  }
}

export default Piedra