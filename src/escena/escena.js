import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";
import Cilindro from "../geometria/objetos_3d/cilindro.js";
import Prisma from "../geometria/objetos_3d/prisma.js";
import EjesDeCoordenadas from "../geometria/objetos_3d/ejes_de_coordenadas.js";

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

    this.catapulta = new Catapulta();
    this.catapulta.setPosition(0, 1, 0);
    this.objetos.push(this.catapulta);
    this.gestorDeCamaras.setPersonaParaCamaraTerceraPersona(this.catapulta);

    var cilindro = new Cilindro(1, 10);
    cilindro.setPosition(1, 10, 0);
    this.objetos.push(cilindro)

    var prisma = new Prisma(1, 3, 2);
    prisma.setPosition(-1, 10, 10);
    cilindro.addChild(prisma);

    EJES_DE_COORDEANDAS = new EjesDeCoordenadas();

    console.log('WORLD CILNDRO', cilindro.getWorldCoordinates())
    console.log('WORLD prisma', prisma.getWorldCoordinates())
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

        case '0': {
          DEBUG_EJES = !DEBUG_EJES;
          if (DEBUG_EJES) {
            this.objetos.forEach(obj => obj.addChild(EJES_DE_COORDEANDAS));
          } else {
            this.objetos.forEach(obj => obj.removeChild(EJES_DE_COORDEANDAS));
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