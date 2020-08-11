import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Piedra extends Material {
  constructor(shaderManager) {
    super('Piedra', {
      ambiente: [12,9,9],
      difuso: [48,48,48],
      especular: [38,10,2],
      glossiness: 10,
    });
    this.shaderProgram = shaderManager.program(ShadersManager.PIEDRA);

    this.textura = TEXTURE_MANAGER.TEXTURA_PIEDRA;
  }
}

export default Piedra