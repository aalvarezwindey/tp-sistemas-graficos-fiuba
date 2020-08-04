import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super('Cesped', {
      ambiente: [10, 33, 13],
      difuso: [3, 5, 3]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);

  }
}

export default Cesped