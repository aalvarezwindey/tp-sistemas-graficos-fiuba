import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super('Pared Castillo', {
      ambiente: [85,85,16],
      difuso: [57,57,16],
      especular: [75,46,21],
      glossiness: 109
    });
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);

    this.textura = TEXTURE_MANAGER.TEXTURA_PARED_CASTILLO;
  }
}

export default Beige;