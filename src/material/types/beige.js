import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super('Pared Castillo', {
      ambiente: [38,38,4],
      difuso: [93,93,12],
      especular: [55,36,22],
      glossiness: 109
    });
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);

    this.textura = TEXTURE_MANAGER.TEXTURA_PARED_CASTILLO;
  }
}

export default Beige;