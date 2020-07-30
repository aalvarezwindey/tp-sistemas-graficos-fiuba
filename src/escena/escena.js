import Objeto3D from "../geometria/objeto_3d.js";
import Catapulta from "./catapulta/catapulta.js";
import EjesDeCoordenadas from "../geometria/objetos_3d/ejes_de_coordenadas.js";
import Castillo from "./castillo/castillo.js";
import Terreno from "./terreno/terreno.js";
import Prisma from "../geometria/objetos_3d/prisma.js";
import Cilindro from "../geometria/objetos_3d/cilindro.js";
import FuenteDeLuzPuntual from "../iluminacion/fuente_de_luz_puntual.js";

class Escena {
  constructor(shadersManager, gestorDeCamaras) {
    EJES_DE_COORDENADAS = new EjesDeCoordenadas();
    this.objetos = [];
    this.shadersManager = shadersManager;
    this.gestorDeCamaras = gestorDeCamaras;
    this._indiceObjetoEnfocado = 0;

    this._iniciarHandlers();

    const EJES_EN_SENTIDO_MUNDO = new Objeto3D();
    EJES_EN_SENTIDO_MUNDO.addChild(EJES_DE_COORDENADAS);
    EJES_EN_SENTIDO_MUNDO.setPosition(20, 0, 0);
    //this.objetos.push(EJES_EN_SENTIDO_MUNDO);

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

    this._iniciarIluminacion();

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

    this._iniciarMenuDatGUI();
  }

  _iniciarIluminacion() {
    this.RADIO_SOL = 1
    this.sol = new FuenteDeLuzPuntual(this.RADIO_SOL);
    const RADIO_ORBITA = 7.0;
    const posicionSolInicial = [0.0, 3.0, RADIO_ORBITA];
    this.sol.setPosition(...posicionSolInicial);
    shadersManager.updatePosicionSol(posicionSolInicial);
    this.objetos.push(this.sol);

    this.sol.setAnimacion(s => {
      const _2pi = Math.PI * 2;
      const nuevaPosicion = [RADIO_ORBITA * Math.sin(TIEMPO * _2pi), 3.0, RADIO_ORBITA * Math.cos(TIEMPO * _2pi)];
      s.setPosition(...nuevaPosicion);
      shadersManager.updatePosicionSol(nuevaPosicion);
    })
  }

  _iniciarMenuDatGUI() {
    this.CONFIG_KEYS = {
      CASTILLO: {
        PISOS: 'Cantidad de pisos',
        LARGO: 'Largo del castillo',
        ANCHO: 'Ancho del castillo',
        LADOS_MURALLA: 'Cantidad de lados de la muralla',
        ALTURA_MURALLA: 'Altura de la muralla'
      },
      BOTON: {
        GENERAR_ESCENA: 'GENERAR ESCENA',
        MOSTRAR_CONTROLES: 'MOSTRAR CONTROLES'
      }
    }

    this.CONFIGURACION = {
      [this.CONFIG_KEYS.CASTILLO.PISOS]: 3,
      [this.CONFIG_KEYS.CASTILLO.LARGO]: 10,
      [this.CONFIG_KEYS.CASTILLO.ANCHO]: 20,
      [this.CONFIG_KEYS.CASTILLO.LADOS_MURALLA]: 8,
      [this.CONFIG_KEYS.CASTILLO.ALTURA_MURALLA]: 7,

      [this.CONFIG_KEYS.BOTON.GENERAR_ESCENA]: () => {
        this._regenerarEscena();
      },

      [this.CONFIG_KEYS.BOTON.MOSTRAR_CONTROLES]: () => {
        this._mostrarControles();
      }
    };

    this.gui = new dat.gui.GUI();
    this.gui.width = 500;

    this.gui.remember(this.CONFIGURACION);
    this.carpetaCastillo = this.gui.addFolder('Castillo');
    this.carpetaCastillo.closed = false;

    this.carpetaCastillo.add(
      this.CONFIGURACION, 
      this.CONFIG_KEYS.CASTILLO.PISOS
    )
    .min(this.castillo.MIN_CANTIDAD_PISOS)
    .max(this.castillo.MAX_CANTIDAD_PISOS)
    .step(1);

    this.carpetaCastillo.add(
      this.CONFIGURACION, 
      this.CONFIG_KEYS.CASTILLO.LARGO
    )
    .min(this.castillo.MIN_LARGO)
    .max(this.castillo.MAX_LARGO)
    .step(0.1);

    this.carpetaCastillo.add(
      this.CONFIGURACION, 
      this.CONFIG_KEYS.CASTILLO.ANCHO
    )
    .min(this.castillo.MIN_ANCHO)
    .max(this.castillo.MAX_ANCHO)
    .step(0.1);

    this.carpetaCastillo.add(
      this.CONFIGURACION, 
      this.CONFIG_KEYS.CASTILLO.LADOS_MURALLA
    )
    .min(this.castillo.MIN_MURALLAS)
    .max(this.castillo.MAX_MURALLAS)
    .step(1);

    this.carpetaCastillo.add(
      this.CONFIGURACION, 
      this.CONFIG_KEYS.CASTILLO.ALTURA_MURALLA
    )
    .min(this.castillo.MIN_ALTURA_MURALLA)
    .max(this.castillo.MAX_ALTURA_MURALLA)
    .step(0.1);

    this.gui.add(this.CONFIGURACION, this.CONFIG_KEYS.BOTON.GENERAR_ESCENA);
    this.gui.add(this.CONFIGURACION, this.CONFIG_KEYS.BOTON.MOSTRAR_CONTROLES);
  }

  _mostrarControles() {
    alert(`
      Presione [T] para cambiar el tipo de cámara (utilice la rueda del mouse para acercar o alejar la cámara orbital y la cámara de tercera persona)
      Presione [C] para cambiar de foco en la cámara orbital
      Presione [W, A, S, D] para moverse en la cámara de primera persona
      Presione [U, H, J, K] para mover la catapulta
      Presione [BARRA ESPACIADORA] para disparar la catapulta (o resetear el disparo)
      Presione los números [1, 2, 3, 4, 5] para variar parámetros del castillo
    `);
  }

  _regenerarEscena() {
    console.log(this.CONFIG_KEYS.CASTILLO.PISOS, this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.PISOS]);
    console.log(this.CONFIG_KEYS.CASTILLO.LARGO, this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.LARGO]);
    console.log(this.CONFIG_KEYS.CASTILLO.ANCHO, this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.ANCHO]);
    console.log(this.CONFIG_KEYS.CASTILLO.LADOS_MURALLA, this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.LADOS_MURALLA]);
    console.log(this.CONFIG_KEYS.CASTILLO.ALTURA_MURALLA, this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.ALTURA_MURALLA]);

    this.castillo._init(
      this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.PISOS],
      this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.LARGO],
      this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.ANCHO],
      this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.LADOS_MURALLA],
      this.CONFIGURACION[this.CONFIG_KEYS.CASTILLO.ALTURA_MURALLA]
    );
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