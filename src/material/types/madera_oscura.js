import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class MaderaOscura extends Material {
  constructor(shaderManager) {
    super('Madera Oscura', {
      ambiente: [17,10,1],
      difuso: [8,5,2],
      especular: [38,11,11],
      glossiness: 1
    });
    this.shaderProgram = shaderManager.program(ShadersManager.MADERA_OSCURA);
    this.textura = TEXTURE_MANAGER.TEXTURA_MADERA_OSCURA;
  }
}

export default MaderaOscura