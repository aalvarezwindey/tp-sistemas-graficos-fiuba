import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaClara extends Material {
  constructor(shaderManager) {
    super('Madera Clara', {
      ambiente: [45,25,4],
      difuso: [35,19,2],
      especular: [42,16,0],
      glossiness: 1
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_CLARA);

    this.textura = TEXTURE_MANAGER.TEXTURA_MADERA_CLARA;
  }
}

export default MaderaClara