import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super('Cesped', {
      ambiente: [16,67,23],
      difuso: [4,40,4],
      especular: [255,113,0],
      glossiness: 5
    });
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);

  }
}

export default Cesped