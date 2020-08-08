import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Piedra extends Material {
  constructor(shaderManager) {
    super('Piedra', {
      ambiente: [42,42,42],
      difuso: [88,86,86],
      especular: [48,15,0],
      glossiness: 10,
    });
    this.shaderProgram = shaderManager.program(ShadersManager.PIEDRA);

  }
}

export default Piedra