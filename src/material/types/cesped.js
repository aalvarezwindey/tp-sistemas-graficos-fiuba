import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super('Cesped', {
      ambiente: [16,67,23],
      difuso: [4,40,4],
      especular: [85,22,0],
      glossiness: 154
    });
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);
    this.textura = TEXTURE_MANAGER.TEXTURA_CESPED;
  }
}

export default Cesped