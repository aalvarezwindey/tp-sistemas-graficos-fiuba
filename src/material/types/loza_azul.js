import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class LozaAzul extends Material {
  constructor(shaderManager) {
    super('Loza Castillo', {
      ambiente: [6,6,42],
      difuso: [7,7,60],
      especular: [213,82,0],
      glossiness: 2
    });
    this.shaderProgram = shaderManager.program(ShadersManager.LOZA_AZUL);
    this.textura = TEXTURE_MANAGER.TEXTURA_LOZA_AZUL;
  }
}

export default LozaAzul