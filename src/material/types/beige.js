import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super('Pared Castillo', {
      ambiente: [13, 17, 1],
      difuso: [10, 10, 5]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);
  }
}

export default Beige;