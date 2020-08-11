import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Agua extends Material {
  constructor(shaderManager) {
    super('Agua', {
      ambiente: [13,13,55],
      difuso: [9,9,70],
      especular: [213,81,0],
      glossiness: 5
    });
    this.shaderProgram = shaderManager.program(ShadersManager.AGUA);
    this.textura = TEXTURE_MANAGER.TEXTURA_AGUA;
  }
}

export default Agua;