import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaClara extends Material {
  constructor(shaderManager) {
    super('Madera Clara', {
      ambiente: [63,45,26],
      difuso: [42, 22, 6],
      especular: [75,31,0],
      glossiness: 1
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_CLARA);

  }
}

export default MaderaClara