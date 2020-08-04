import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Vidrio extends Material {
  constructor(shaderManager) {
    super('Vidrio Ventana', {
      ambiente: [15, 9, 9],
      difuso: [13, 10, 10]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.VIDRIO);

  }
}

export default Vidrio