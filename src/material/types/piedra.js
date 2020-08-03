import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Piedra extends Material {
  constructor(shaderManager) {
    super('Piedra', {
      ambiente: [.60784, .60784, 0.60784],
      difuso: [.60784, .60784, 0.60784]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.PIEDRA);

  }
}

export default Piedra