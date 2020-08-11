import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super('Cesped', {
      ambiente: [2,33,5],
      difuso: [5,60,5],
      especular: [100,30,0],
      glossiness: 18
    });
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);
    this.textura = TEXTURE_MANAGER.TEXTURA_CESPED;
    this.textura_2 = TEXTURE_MANAGER.TEXTURA_CESPED_2;
    this.textura_3 = TEXTURE_MANAGER.TEXTURA_CESPED_3;
  }
}

export default Cesped