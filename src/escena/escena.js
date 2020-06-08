import Objeto3D from "../geometria/objeto_3d.js";
import Esfera from '../geometria/superficies_parametricas/superficies/sphere.js';
import DefaultMaterial from "../material/types/default_material.js";
import SuperficieBarrido from "../geometria/superficie_barrido/superficie_barrido.js";
import Circulo from "../geometria/superficie_barrido/poligonos/circulo.js";
import Recta from "../geometria/superficie_barrido/recorridos_parametricos/recta.js";
import Rectangulo from "../geometria/superficie_barrido/poligonos/rectangulo.js";
import Circunferencia from "../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    console.log('Escena', gestorDeCamaras);
    this.objetos = [];
    this.shadersManager = shadersManager;
    this.gestorDeCamaras = gestorDeCamaras;

    this._iniciarHandlers();

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

  _iniciarHandlers = () => {

    // Switcher de camaras
    document.addEventListener('keydown', event => {
      const keyCode = event.keyCode;
      //console.log('keyCode', keyCode)

      switch(keyCode) {
        // 't'
        case 84: {
          this.gestorDeCamaras.proximaCamara();
          break;
        }

        default: {
          break;
        }
      }
    });
  }

  render = (rootMatrix) => {
    this.objetos.forEach(obj => obj.render(rootMatrix));
  }

  updateViewMatrix = () => {
    const matrizDeVista = this.gestorDeCamaras.getCamara().getMatrizDeVista();
    this.shadersManager.updateShadersViewMatrix(matrizDeVista)
  }

  updateProjectionMatrix = (projectionMatrix) => {
    this.shadersManager.updateShadersProjectionMatrix(projectionMatrix)
  }
}

export default Escena;