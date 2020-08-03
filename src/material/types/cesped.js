import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super('Cesped', {
      ambiente: [67.0 / 255.0, 143.0 / 255.0, 73.0 / 255.0],
      difuso: [67.0 / 255.0, 143.0 / 255.0, 73.0 / 255.0]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);

  }
}

export default Cesped