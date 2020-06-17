import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";
import Cilindro from "../geometria/objetos_3d/cilindro.js";
import Prisma from "../geometria/objetos_3d/prisma.js";
import EjesDeCoordenadas from "../geometria/objetos_3d/ejes_de_coordenadas.js";
import Lingote from "../geometria/objetos_3d/lingote.js";
import Castillo from "./castillo/castillo.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    EJES_DE_COORDEANDAS = new EjesDeCoordenadas();
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
    this.catapulta.setPosition(0, 0, 0);
    this.objetos.push(this.catapulta);
    this.gestorDeCamaras.setPersonaParaCamaraTerceraPersona(this.catapulta);

    this.castillo = new Castillo();
    this.castillo.setPosition(30, 0, 0);
    this.objetos.push(this.castillo);

    var cilindro = new Cilindro(1, 10);
    cilindro.setPosition(100, 100, 100);
    this.objetos.push(cilindro)

    var prisma = new Prisma(1, 3, 2);
    prisma.setPosition(2, 2, 2);
    cilindro.addChild(prisma);

    var lingote = new Lingote(10, 5, 4, 2);
    lingote.setPosition(3, 3, 3);
    prisma.addChild(lingote)

    PUNTO_1 = new Cilindro(0, 0);
    PUNTO_1.setPosition(...P1)
    this.objetos.push(PUNTO_1)

    PUNTO_2 = new Cilindro(0, 0);
    PUNTO_2.setPosition(...P2)
    this.objetos.push(PUNTO_2)

    console.log('WORLD cilindro', cilindro.getWorldCoordinates())
    console.log('WORLD prisma', prisma.getWorldCoordinates())
    console.log('WORLD lingote', lingote.getWorldCoordinates())
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