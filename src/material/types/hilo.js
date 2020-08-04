import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Hilo extends Material {
  constructor(shaderManager) {
    super('Hilo', {
      ambiente: [23, 22, 22],
      difuso: [10, 9, 9]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.HILO);

  }
}

export default Hilo