import Objeto3D from "../geometria/objeto_3d.js";
import Esfera from '../geometria/superficies_parametricas/superficies/sphere.js';
import DefaultMaterial from "../material/types/default_material.js";
import SuperficieBarrido from "../geometria/superficie_barrido/superficie_barrido.js";
import Circulo from "../geometria/superficie_barrido/poligonos/circulo.js";
import Recta from "../geometria/superficie_barrido/recorridos_parametricos/recta.js";
import Rectangulo from "../geometria/superficie_barrido/poligonos/rectangulo.js";
import Circunferencia from "../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js";

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

    objeto = new Objeto3D({
      geometry: new Esfera(1),
      material: defaultMaterial,
      glContext: gl
    });
    objeto.setPosition(4, 2, 0);
    this.objetos.push(objeto);

    objeto = new Objeto3D({
      geometry: new SuperficieBarrido(new Circulo(0.2, 100), new Circunferencia(5)),
      material: defaultMaterial,
      glContext: gl
    });
    objeto.setPosition(0, 1, 0);
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