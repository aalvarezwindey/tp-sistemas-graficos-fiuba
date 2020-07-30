import Material from "../material.js";
import ShadersManager from "../../shaders/shaders_manager.js";

class Cesped extends Material {
  constructor(shaderManager) {
    super();
    this.shaderProgram = shaderManager.program(ShadersManager.CESPED);

  }
}

export default Cesped