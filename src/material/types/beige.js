import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super('Pared Castillo', {
      ambiente: [103.0 / 255.0, 107.0 / 255.0, 29.0 / 255.0],
      difuso: [103.0 / 255.0, 107.0 / 255.0, 29.0 / 255.0]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);
  }
}

export default Beige;