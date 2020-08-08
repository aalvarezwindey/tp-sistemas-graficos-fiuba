import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super('Pared Castillo', {
      ambiente: [85,85,16],
      difuso: [57,57,16],
      especular: [213,97,52],
      glossiness: 109
    });
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);
  }
}

export default Beige;