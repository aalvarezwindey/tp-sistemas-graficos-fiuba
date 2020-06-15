import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    this.objetos = [];
    this.shadersManager = shadersManager;
    this.gestorDeCamaras = gestorDeCamaras;
    this._indiceObjetoEnfocado = 0;

    this._iniciarHandlers();

    let objeto;

    objeto = new Objeto3D({
      geometry: new Plano(200, 200),
      material: DEFAULT_MATERIAL,
      glContext: gl
    });
    objeto.setPosition(0, 0, 0);
    this.objetos.push(objeto);

    objeto = new Catapulta();
    objeto.setPosition(0, 10, 0);
    this.objetos.push(objeto);
  }

  _iniciarHandlers = () => {
    // Switcher de camaras
    document.addEventListener('keydown', event => {
      switch(event.key) {
        case 't': {
          this.gestorDeCamaras.proximaCamara();
          break;
        }

        case 'c': {
          // Actualizamos objeto enfocado
          this._indiceObjetoEnfocado += 1;
          if (this._indiceObjetoEnfocado === this.objetos.length) {
            this._indiceObjetoEnfocado = 0;
          }

          this.gestorDeCamaras.cambiarObjetivo(this.objetos[this._indiceObjetoEnfocado])
          break;
        }

        // Detiene el paso del tiempo
        case 'p': {
          PAUSA = !PAUSA;
          break;
        }

        // Resetea el tiempo
        case 'r': {
          TIEMPO = 0;
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