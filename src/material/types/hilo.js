import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Hilo extends Material {
  constructor(shaderManager) {
    super('Hilo', {
      ambiente: [0.843137, 0.843137, 0.843137],
      difuso: [0.843137, 0.843137, 0.843137]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.HILO);

  }
}

export default Hilo