import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaClara extends Material {
  constructor(shaderManager) {
    super('Madera Clara', {
      ambiente: [65.0/255.0, 44.0/255.0, 45.0/255.0],
      difuso: [65.0/255.0, 44.0/255.0, 45.0/255.0]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_CLARA);

  }
}

export default MaderaClara