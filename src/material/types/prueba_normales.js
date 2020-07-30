import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class PruebaNormales extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.PRUEBA_NORMALES);

  }
}

export default PruebaNormales