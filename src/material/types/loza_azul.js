import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class LozaAzul extends Material {
  constructor(shaderManager) {
    super('Loza Castillo', {
      ambiente: [35,35,73],
      difuso: [12,12,42],
      especular: [115,53,14],
      glossiness: 2
    });
    this.shaderProgram = shaderManager.program(ShadersManager.LOZA_AZUL);
    this.textura = TEXTURE_MANAGER.TEXTURA_LOZA_AZUL;
  }
}

export default LozaAzul