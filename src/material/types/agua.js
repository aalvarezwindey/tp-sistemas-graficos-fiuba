import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Agua extends Material {
  constructor(shaderManager) {
    super('Agua', {
      ambiente: [35,35,80],
      difuso: [47,47,130],
      especular: [255,139,0],
      glossiness: 29
    });
    this.shaderProgram = shaderManager.program(ShadersManager.AGUA);

  }
}

export default Agua;