import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";
import EjesDeCoordenadas from "../geometria/objetos_3d/ejes_de_coordenadas.js";
import Castillo from "./castillo/castillo.js";
import SuperficieBarrido from "../geometria/superficie_barrido/superficie_barrido.js";
import PerfilMuralla from "../geometria/superficie_barrido/poligonos/perfil_muralla.js";
import Recta from "../geometria/superficie_barrido/recorridos_parametricos/recta.js";
import Circunferencia from "../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js";
import PerfilTorreMuralla from "../geometria/superficie_barrido/poligonos/perfil_torre_muralla.js";
import Terreno from "./terreno/terreno.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    EJES_DE_COORDENADAS = new EjesDeCoordenadas();
    this.objetos = [];
    this.shadersManager = shadersManager;
    this.gestorDeCamaras = gestorDeCamaras;
    this._indiceObjetoEnfocado = 0;

    this._iniciarHandlers();

    let objeto;

    this.terreno = new Terreno();
    this.terreno.addChild(EJES_DE_COORDENADAS)
    this.terreno.setPosition(0, 0, 0);
    this.terreno.setRotation(-Math.PI / 2, 0, 0);
    this.objetos.push(this.terreno);


    this.catapulta = new Catapulta();
    this.catapulta.setPosition(30, 0, 0);
    this.objetos.push(this.catapulta);
    this.gestorDeCamaras.setPersonaParaCamaraTerceraPersona(this.catapulta);

    this.castillo = new Castillo();
    this.castillo.setPosition(0, 0, 0);
    this.objetos.push(this.castillo);

    objeto = new Objeto3D({
      geometry: new SuperficieBarrido(new PerfilTorreMuralla(), new Circunferencia(0.01), false),
      material: MATERIAL_PIEDRA,
      glContext: gl
    });
    objeto.setPosition(0, 50, 50);
    //objeto.setScale(1,1,4)
    objeto.addChild(EJES_DE_COORDENADAS)
    this.objetos.push(objeto);

    this._ajustarEscalaDeEscena();    

    this.gestorDeCamaras.cambiarObjetivo(this.castillo);
  }

  _ajustarEscalaDeEscena = () => {
    this.objetos.forEach(obj => obj.setScale(0.5, 0.5, 0.5));
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

        case '1': {
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
        }

        case '4': {
          this.castillo.variarMuralla()
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