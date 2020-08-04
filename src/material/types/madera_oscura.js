import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaOscura extends Material {
  constructor(shaderManager) {
    super('Madera Oscura', {
      ambiente:[25, 16, 16],
      difuso: [2, 1, 1]
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_OSCURA);

  }
}

export default MaderaOscura