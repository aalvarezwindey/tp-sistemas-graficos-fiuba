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

    this.proyectilDesprendido = new Objeto3D();
    this.proyectilDesprendido.setAnimacion(sistemaDeReferencia => {
      if (PROYECTIL_DESPRENDIDO) {
        if (!sistemaDeReferencia.hasChild(PROYECTIL_CATAPULTA) && POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE) {
          sistemaDeReferencia.addChild(PROYECTIL_CATAPULTA);
          sistemaDeReferencia.setPosition(...POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE);
        }

        const x0 = POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE[0];
        const y0 = POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE[1];
        const z0 = POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE[2];
        const V_FRONTAL_0 = 10;
        const V_VERTICAL_0 = 5;
        const g = 9.81;
        const v_animacion = 10;
        const t = (TIEMPO - TIEMPO_INICIAL_DESPRENDIMIENTO) * v_animacion;

        const x = x0 + FRONTAL_CATAPULTA_AL_DISPARAR[0] * V_FRONTAL_0 * t;
        const y = Math.max(y0 + V_VERTICAL_0 * t - 0.5 * g * t * t, PROYECTIL_CATAPULTA.radio); // Validamos que no toco el piso
        const z = z0 + FRONTAL_CATAPULTA_AL_DISPARAR[2] * V_FRONTAL_0 * t;

        sistemaDeReferencia.setPosition(x, y, z);
      } else {
        if (sistemaDeReferencia.hasChild(PROYECTIL_CATAPULTA)) {
          sistemaDeReferencia.removeChild(PROYECTIL_CATAPULTA);
        }
      }
    });
    this.objetos.push(this.proyectilDesprendido);

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
          this.castillo.variarLadosDeMuralla()
          break;
        }

        case '5': {
          this.castillo.variarAlturaDeMuralla()
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