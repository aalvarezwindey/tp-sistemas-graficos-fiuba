import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";
import EjesDeCoordenadas from "../geometria/objetos_3d/ejes_de_coordenadas.js";
import Castillo from "./castillo/castillo.js";
import SuperficieBarrido from "../geometria/superficie_barrido/superficie_barrido.js";
import PerfilMuralla from "../geometria/superficie_barrido/poligonos/perfil_muralla.js";
import Recta from "../geometria/superficie_barrido/recorridos_parametricos/recta.js";
import Circunferencia from "../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    EJES_DE_COORDENADAS = new EjesDeCoordenadas();
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

    this.catapulta = new Catapulta();
    this.catapulta.setPosition(30, 0, 0);
    this.objetos.push(this.catapulta);
    this.gestorDeCamaras.setPersonaParaCamaraTerceraPersona(this.catapulta);

    this.castillo = new Castillo();
    this.castillo.setPosition(0, 0, 0);
    this.castillo.setScale(2, 2, 2)
    this.objetos.push(this.castillo);

    this.gestorDeCamaras.cambiarObjetivo(this.castillo);
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

/*         case '1': {
          this.castillo.variarPisos()
          break;
        }

        case '2': {
          this.castillo.variarLargo()
          break;
        }

        case '3': {
          this.castillo.variarAncho()
          break;
        } */

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

        case '0': {
          DEBUG_EJES = !DEBUG_EJES;
          if (DEBUG_EJES) {
            this.objetos.forEach(obj => obj.addChild(EJES_DE_COORDENADAS));
          } else {
            this.objetos.forEach(obj => obj.removeChild(EJES_DE_COORDENADAS));
          }
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