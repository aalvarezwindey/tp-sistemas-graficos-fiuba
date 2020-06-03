import Objeto3D from "../geometria/objeto_3d.js";
import Esfera from '../geometria/superficies_parametricas/superficies/sphere.js';
import DefaultMaterial from "../material/types/default_material.js";

class Escena {
  constructor(shadersManager) {
    this.objetos = [];
    this.shadersManager = shadersManager;

    let objeto;
    const defaultMaterial = new DefaultMaterial(shadersManager);

    objeto = new Objeto3D({
      geometry: new Esfera(1),
      material: defaultMaterial,
      glContext: gl
    });
    objeto.setPosition(0, 1, 0);

    this.objetos.push(objeto);

    objeto = new Objeto3D({
      geometry: new Plano(20, 20),
      material: defaultMaterial,
      glContext: gl
    });
    objeto.setPosition(0, -1, 0);

    this.objetos.push(objeto);
  }

  render = (rootMatrix) => {
    this.objetos.forEach(obj => obj.render(rootMatrix));
  }

  updateViewMatrix = (viewMatrix) => {
    this.shadersManager.updateShadersViewMatrix(viewMatrix)
  }

  updateProjectionMatrix = (projectionMatrix) => {
    this.shadersManager.updateShadersProjectionMatrix(projectionMatrix)
  }
}

export default Escena;