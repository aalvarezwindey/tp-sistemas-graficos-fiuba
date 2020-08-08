import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Hilo extends Material {
  constructor(shaderManager) {
    super('Hilo', {
      ambiente: [55,53,53],
      difuso: [147,147,147],
      especular: [78,44,14],
      glossiness: 1
    });
    this.shaderProgram = shaderManager.program(ShadersManager.HILO);

  }
}

export default Hilo