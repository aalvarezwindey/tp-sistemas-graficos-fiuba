import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Beige extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.BEIGE);

  }
}

export default Beige;