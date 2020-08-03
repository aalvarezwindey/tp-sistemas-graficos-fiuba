import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Agua extends Material {
  constructor(shaderManager) {
    super('Agua', {
      ambiente: [135.0 / 255.0, 167.0 / 255.0, 206.0 / 255.0],
      difuso: [135.0 / 255.0, 167.0 / 255.0, 206.0 / 255.0]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.AGUA);

  }
}

export default Agua;