import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaOscura extends Material {
  constructor(shaderManager) {
    super('Madera Oscura', {
      ambiente: [42,22,3],
      difuso: [67,40,17],
      especular: [45,15,15],
      glossiness: 1
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_OSCURA);

  }
}

export default MaderaOscura