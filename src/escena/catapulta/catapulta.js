import Objeto3D from '../../geometria/objeto_3d.js'
import Cilindro from '../../geometria/objetos_3d/cilindro.js';
import Prisma from '../../geometria/objetos_3d/prisma.js';
import Lingote from '../../geometria/objetos_3d/lingote.js';

var OVILLO_CUCHARA = null;
var OVILLO_TRAVESAÑO_TRASERO = null;
var HILO = null;


class Rueda extends Objeto3D {
  constructor() {
    super();

    // Creates geometria only the first time
    Rueda.cilindro = Rueda.cilindro || new Cilindro(Rueda.RADIO, Rueda.ANCHO, MATERIAL_MADERA_CLARA);

    this.addChild(Rueda.cilindro);
  }
}

class EjeDeRuedas extends Objeto3D {
  LARGO = 8;
  RADIO_EJE = 0.1;

  constructor() {
    super();

    // Creates geometria only the first time
    EjeDeRuedas.cilindro = EjeDeRuedas.cilindro || new Cilindro(EjeDeRuedas.RADIO_EJE, EjeDeRuedas.LARGO, MATERIAL_MADERA_OSCURA);

    this.addChild(EjeDeRuedas.cilindro);
  }
}

class TrenDeRuedas extends Objeto3D {
  constructor() {
    super();
    this.rueda1 = new Rueda();
    this.rueda2 = new Rueda();
    this.eje = new EjeDeRuedas();

    this.eje.addChild(this.rueda1);
    this.eje.addChild(this.rueda2);

    this.rueda1.setPosition(- (EjeDeRuedas.LARGO / 2 - (TrenDeRuedas.ENCASTRE + Rueda.ANCHO / 2)), 0, 0);
    this.rueda2.setPosition(+ (EjeDeRuedas.LARGO / 2 - (TrenDeRuedas.ENCASTRE + Rueda.ANCHO / 2)), 0, 0);

    this.addChild(this.eje);
  }
}

class PlataformaCatapulta extends Objeto3D {
  constructor() {
    super();

    PlataformaCatapulta.prisma = (
      PlataformaCatapulta.prisma
      ||
      new Prisma(PlataformaCatapulta.LARGO, PlataformaCatapulta.ANCHO, PlataformaCatapulta.ESPESOR, MATERIAL_MADERA_CLARA)
    );

    // TODO: No estoy seguro si es mejor rotar el Prisma o PlataformaCatapulta
    PlataformaCatapulta.prisma.setRotation(Math.PI / 2, Math.PI / 2, 0);
    this.addChild(PlataformaCatapulta.prisma);

    const travesañoDelantero = new TravesañoDelantero();
    travesañoDelantero.setPosition(0, 0, - TravesañoDelantero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_DELANTERO);
    this.addChild(travesañoDelantero);

    const travesañoTrasero = new TravesañoTrasero();
    travesañoTrasero.setPosition(0, 0, TravesañoTrasero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_TRASERO);
    this.addChild(travesañoTrasero);
  }
}

class TravesañoDelantero extends Objeto3D {
  constructor() {
    super();
    const sistemaDeReferencia = new Objeto3D();

    const lingoteIzquierdo = new Lingote(
      TravesañoDelantero.ANCHO_INF_LINGOTES,
      TravesañoDelantero.ANCHO_SUP_LINGOTES,
      TravesañoDelantero.ALTURA_LINGOTES,
      TravesañoDelantero.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteIzquierdo.setRotation(-Math.PI / 2, 0, 0);
    lingoteIzquierdo.setPosition(-TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES / 2, TravesañoDelantero.ALTURA_LINGOTES / 2, 0);
    sistemaDeReferencia.addChild(lingoteIzquierdo);

    const lingoteDerecho = new Lingote(
      TravesañoDelantero.ANCHO_INF_LINGOTES,
      TravesañoDelantero.ANCHO_SUP_LINGOTES,
      TravesañoDelantero.ALTURA_LINGOTES,
      TravesañoDelantero.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteDerecho.setRotation(-Math.PI / 2, 0, 0);
    lingoteDerecho.setPosition(TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES / 2, TravesañoDelantero.ALTURA_LINGOTES / 2, 0);
    sistemaDeReferencia.addChild(lingoteDerecho);

    // Eje
    const eje = new EjeTravesañoDelantero();
    eje.setPosition(0, EjeTravesañoDelantero.ALTURA_EJE, 0);
    sistemaDeReferencia.addChild(eje);

    this.addChild(sistemaDeReferencia);
  }
}

class EjeTravesañoDelantero extends Objeto3D {
  constructor() {
    super();
    const eje = new Cilindro(EjeTravesañoDelantero.RADIO_EJE, EjeTravesañoDelantero.LARGO_EJE, MATERIAL_MADERA_OSCURA);
    const cuchara = new CucharaCatapulta();
    this.disparar = false;
    eje.addChild(cuchara);
    this.addChild(eje)

    this.setAnimacion((ejeTravesañoDelantero) => {
      if (this.disparar) {
        const VELOCIDAD = 20;
        const ANGULO_MAX = Math.PI / 4;
        const anguloDeRotacion = Math.max(-ANGULO_MAX, -(TIEMPO - this.tiempoInicial) * VELOCIDAD * ANGULO_MAX);
        ejeTravesañoDelantero.setRotation(anguloDeRotacion, 0, 0);

        HILO.actualizarRotacion();

        // Seteamos esta variable para poder contrarrestar el giro en el contrapeso
        cuchara.contrapeso.eje.setRotation(anguloDeRotacion, 0, 0);
      } else {
        ejeTravesañoDelantero.setRotation(0, 0, 0);
        cuchara.contrapeso.eje.setRotation(0, 0, 0);
        HILO.setEstadoInicial();
      }
    });

    document.addEventListener('keydown', event => {
      switch (event.keyCode) {
        // Barra espaciadora => Disparamos catapulta
        case 32: {
          this.disparar = !this.disparar;
          this.tiempoInicial = TIEMPO;
        }

        default: {
          break;
        }
      }
    });
  }
}

class CucharaCatapulta extends Objeto3D {
  constructor() {
    super();

    // El sistema de referencia es a partir de la unión con el eje del travesaño delantero
    const sistemaDeReferencia = new Objeto3D();

    const mango = new Prisma(
      CucharaCatapulta.LARGO_MANGO,
      CucharaCatapulta.ANCHO_MANGO,
      CucharaCatapulta.ESPESOR,
      MATERIAL_MADERA_CLARA
    );
    mango.setRotation(Math.PI / 2, Math.PI / 2, 0);
    mango.setPosition(
      0,
      EjeTravesañoDelantero.RADIO_EJE,
      CucharaCatapulta.DESPLAZAMIENTO_CUCHARA_SOBRE_EJE
    );

    const cabezaCuchara = new Prisma(
      CucharaCatapulta.LARGO_CUADRADO_CUCHARA,
      CucharaCatapulta.LARGO_CUADRADO_CUCHARA,
      CucharaCatapulta.ESPESOR,
      MATERIAL_MADERA_CLARA
    );

    cabezaCuchara.setPosition(0, CucharaCatapulta.LARGO_MANGO / 2 + CucharaCatapulta.LARGO_CUADRADO_CUCHARA / 2, 0)
    mango.addChild(cabezaCuchara);

    const ovilloCuchara = new Cilindro(
      CucharaCatapulta.RADIO_OVILLO,
      CucharaCatapulta.ANCHO_OVILLO,
      MATERIAL_HILO
    );
    OVILLO_CUCHARA =  ovilloCuchara;

    ovilloCuchara.setPosition(0, EjeTravesañoDelantero.RADIO_EJE, CucharaCatapulta.DISTANCIA_ENTRE_EJES_DE_TRAVESAÑOS);
    ovilloCuchara.setRotation(0, Math.PI / 2, 0);

    sistemaDeReferencia.addChild(mango);
    sistemaDeReferencia.addChild(ovilloCuchara);

    this.contrapeso = new ContrapesoCuchara();
    this.contrapeso.setRotation(Math.PI / 2, 0, - Math.PI / 2);

    this.contrapeso.setPosition(
      CucharaCatapulta.ESPESOR / 2 - (ContrapesoCuchara.RADIO_EJE + ContrapesoCuchara.DISTANCIA_EJE_A_BORDE_LINGOTE),
      - CucharaCatapulta.LARGO_MANGO / 2 + ContrapesoCuchara.ANCHO_SUP_LINGOTES / 2,
      0)
    ;

    mango.addChild(this.contrapeso);

    this.addChild(sistemaDeReferencia);
  }
}

class ContrapesoCuchara extends Objeto3D {
  constructor() {
    super();

    // Eje
    this.eje = new Cilindro(ContrapesoCuchara.RADIO_EJE, ContrapesoCuchara.LARGO_EJE, MATERIAL_MADERA_OSCURA);

    // Travesaños hijos del eje
    const lingoteIzquierdo = new Lingote(
      ContrapesoCuchara.ANCHO_INF_LINGOTES,
      ContrapesoCuchara.ANCHO_SUP_LINGOTES,
      ContrapesoCuchara.ALTURA_LINGOTES,
      ContrapesoCuchara.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteIzquierdo.setRotation(-Math.PI / 2, 0, 0);
    lingoteIzquierdo.setPosition(
      - ContrapesoCuchara.DISTANCIA_ENTRE_LINGOTES / 2,
      - ContrapesoCuchara.ALTURA_LINGOTES / 2 + ContrapesoCuchara.RADIO_EJE + ContrapesoCuchara.DISTANCIA_EJE_A_BORDE_LINGOTE,
      0
    );
    this.eje.addChild(lingoteIzquierdo);

    const lingoteDerecho = new Lingote(
      ContrapesoCuchara.ANCHO_INF_LINGOTES,
      ContrapesoCuchara.ANCHO_SUP_LINGOTES,
      ContrapesoCuchara.ALTURA_LINGOTES,
      ContrapesoCuchara.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteDerecho.setRotation(-Math.PI / 2, 0, 0);
    lingoteDerecho.setPosition(
      + ContrapesoCuchara.DISTANCIA_ENTRE_LINGOTES / 2,
      - ContrapesoCuchara.ALTURA_LINGOTES / 2 + ContrapesoCuchara.RADIO_EJE + ContrapesoCuchara.DISTANCIA_EJE_A_BORDE_LINGOTE,
      0
    );
    this.eje.addChild(lingoteDerecho);

    // bloque contrapeso
    const cuboDeContrapeso = new Prisma(
      ContrapesoCuchara.LADO_CUBO_CONTRAPESO,
      ContrapesoCuchara.LADO_CUBO_CONTRAPESO,
      ContrapesoCuchara.LADO_CUBO_CONTRAPESO,
      MATERIAL_PIEDRA
    );

    cuboDeContrapeso.setPosition(
      0,
      - ContrapesoCuchara.ALTURA_LINGOTES + ContrapesoCuchara.RADIO_EJE + ContrapesoCuchara.DISTANCIA_EJE_A_BORDE_LINGOTE - ContrapesoCuchara.LADO_CUBO_CONTRAPESO / 2,
      0
    );
    this.eje.addChild(cuboDeContrapeso);

    this.addChild(this.eje);
  }
}

class TravesañoTrasero extends Objeto3D {
  constructor() {
    super();
    const sistemaDeReferencia = new Objeto3D();

    const lingoteIzquierdo = new Lingote(
      TravesañoTrasero.ANCHO_INF_LINGOTES,
      TravesañoTrasero.ANCHO_SUP_LINGOTES,
      TravesañoTrasero.ALTURA_LINGOTES,
      TravesañoTrasero.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteIzquierdo.setRotation(-Math.PI / 2, 0, 0);
    lingoteIzquierdo.setPosition(-TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES / 2, TravesañoTrasero.ALTURA_LINGOTES / 2, 0);

    sistemaDeReferencia.addChild(lingoteIzquierdo);

    const lingoteDerecho = new Lingote(
      TravesañoTrasero.ANCHO_INF_LINGOTES,
      TravesañoTrasero.ANCHO_SUP_LINGOTES,
      TravesañoTrasero.ALTURA_LINGOTES,
      TravesañoTrasero.LARGO_LINGOTE,
      MATERIAL_MADERA_CLARA
    );
    lingoteDerecho.setRotation(-Math.PI / 2, 0, 0);
    lingoteDerecho.setPosition(TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES / 2, TravesañoTrasero.ALTURA_LINGOTES / 2, 0);

    sistemaDeReferencia.addChild(lingoteDerecho);

    // Eje
    const eje = new EjeTravesañoTrasero();
    eje.setPosition(0, EjeTravesañoTrasero.ALTURA_EJE, 0);
    sistemaDeReferencia.addChild(eje);

    this.addChild(sistemaDeReferencia);
  }
}

class EjeTravesañoTrasero extends Objeto3D {
  constructor() {
    super();
      const eje = new Cilindro(EjeTravesañoTrasero.RADIO_EJE, EjeTravesañoTrasero.LARGO_EJE, MATERIAL_MADERA_OSCURA);
      this.addChild(eje)

      const contraEje1 = new ContraEjeTravesañoTrasero();
      const contraEje2 = new ContraEjeTravesañoTrasero();

      contraEje1.setPosition(- ContraEjeTravesañoTrasero.DISTANCIA_CENTRO_A_CONTRAEJES, 0, 0);
      contraEje1.setRotation(0, Math.PI / 2, Math.PI / 2);
      this.addChild(contraEje1);

      contraEje2.setPosition(+ ContraEjeTravesañoTrasero.DISTANCIA_CENTRO_A_CONTRAEJES, 0, 0);
      contraEje2.setRotation(0, Math.PI / 2, Math.PI / 2);
      this.addChild(contraEje2);

      const ovillo = new Ovillo();
      OVILLO_TRAVESAÑO_TRASERO = ovillo;
      this.addChild(ovillo);
  }
}

class Ovillo extends Objeto3D {
  constructor() {
    super();

    this.addChild(new Cilindro(Ovillo.RADIO, Ovillo.ANCHO, MATERIAL_HILO));
  }
}

class ContraEjeTravesañoTrasero extends Objeto3D {
  constructor() {
    super();
    // Creates geometria only the first time
    ContraEjeTravesañoTrasero.cilindro = (
      ContraEjeTravesañoTrasero.cilindro 
      ||
      new Cilindro(ContraEjeTravesañoTrasero.RADIO_CONTRAEJES, ContraEjeTravesañoTrasero.LARGO_CONTRAEJES, MATERIAL_MADERA_CLARA)
    );
    this.addChild(ContraEjeTravesañoTrasero.cilindro);
  }
}

class Hilo extends Objeto3D {
  constructor() {
    super();
    this.distanciaInicial = vec3.distance(OVILLO_CUCHARA.getWorldCoordinates(), OVILLO_TRAVESAÑO_TRASERO.getWorldCoordinates());
    this.hilo = new Cilindro(Hilo.RADIO, 1, MATERIAL_HILO);

    this.setEstadoInicial();
    this.addChild(this.hilo);
    OVILLO_TRAVESAÑO_TRASERO.addChild(this);
  }

  actualizarRotacion = () => {
    const p1 = OVILLO_CUCHARA.getWorldCoordinates();
    const p2 = OVILLO_TRAVESAÑO_TRASERO.getWorldCoordinates()
    const distancia = vec3.distance(p1, p2);

    const matrizDeRotacion = mat4.create()
    mat4.lookAt(matrizDeRotacion, p1, p2, [0, 1, 0]);
    mat4.mul(this.hilo.modelMatrix, this.hilo.modelMatrix, matrizDeRotacion);
    this.hilo.setPosition(0, distancia / 2, 0);
    this.hilo.setScale(distancia, 1, 1);
  }

  setEstadoInicial() {
    this.hilo.setPosition(0, this.distanciaInicial / 2, 0);
    this.hilo.setRotation(0, 0, Math.PI / 2);
    this.hilo.setScale(this.distanciaInicial, 1, 1);
  }
}

class Catapulta extends Objeto3D {
  constructor() {
    super();

    // Valores de movimiento
    this.OFFSET_DE_ROTACION = Math.PI / 8;
    this.OFFSET_DE_MOVIMIENTO = 10;
    this.frontal = [0, 0, 1];

    const trenDelantero = new TrenDeRuedas();
    const trenTrasero = new TrenDeRuedas();
    const plataforma = new PlataformaCatapulta();

    trenDelantero.setPosition(0, 0, - Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS / 2);
    trenTrasero.setPosition(0, 0, + Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS / 2);

    this.addChild(trenDelantero);
    this.addChild(trenTrasero);
    this.addChild(plataforma);

    HILO = new Hilo();

    this._inicarControles();
  }

  _inicarControles = () => {
    document.addEventListener('keydown', event => {
      switch (event.key) {
        // Barra espaciadora => Disparamos catapulta
        case 'u': {
          this._avanzar();
          break;
        }

        case 'j': {
          this._retroceder();
          break;
        }

        case 'h': {
          this._girarIzquierda()
          break;
        }

        case 'k': {
          this._girarDerecha();
          break;
        }

        default: {
          break;
        }
      }
    });
  }

  _avanzar = () => {
    const posicionActual = this.position;
    this.setPosition(
      posicionActual[0] - this.frontal[0] * this.OFFSET_DE_MOVIMIENTO,
      posicionActual[1],
      posicionActual[2] - this.frontal[2] * this.OFFSET_DE_MOVIMIENTO
    );
  }

  _retroceder = () => {
    const posicionActual = this.position;
    this.setPosition(
      posicionActual[0] + this.frontal[0] * this.OFFSET_DE_MOVIMIENTO,
      posicionActual[1],
      posicionActual[2] + this.frontal[2] * this.OFFSET_DE_MOVIMIENTO
    );
  }

  _girarDerecha = () => {
    this.setRotation(0, this.rotation[1] - this.OFFSET_DE_ROTACION, 0);
    this._actualizarFrontal();
  }

  _girarIzquierda = () => {
    this.setRotation(0, this.rotation[1] + this.OFFSET_DE_ROTACION, 0);
    this._actualizarFrontal();
  }

  _actualizarFrontal = () => {
    this.frontal = vec3.fromValues(0, 0, 1);

    const m = mat4.create();

    // Tomamos la rotacion en Y de la catapulta
    mat4.fromYRotation(m, this.rotation[1]);
    vec3.transformMat4(this.frontal, this.frontal, m);
  }
}

// Parametros de las partes de la catapulta
Rueda.ANCHO = 0.2;
Rueda.RADIO = 1;

EjeDeRuedas.LARGO = 6;
EjeDeRuedas.RADIO_EJE = 0.1;

TrenDeRuedas.ENCASTRE = 0.08

Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS = 8;

PlataformaCatapulta.ANCHO = EjeDeRuedas.LARGO - (TrenDeRuedas.ENCASTRE * 2) - (Rueda.ANCHO * 2)
PlataformaCatapulta.LARGO_EXCEDENTE = 0.2;
PlataformaCatapulta.LARGO = Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS + (Rueda.RADIO * 2) + PlataformaCatapulta.LARGO_EXCEDENTE;
PlataformaCatapulta.ESPESOR = 0.35;

TravesañoDelantero.ANCHO_INF_LINGOTES = PlataformaCatapulta.LARGO / 4;
TravesañoDelantero.ANCHO_SUP_LINGOTES = TravesañoDelantero.ANCHO_INF_LINGOTES / 2.5;
TravesañoDelantero.ALTURA_LINGOTES = 5;
TravesañoDelantero.LARGO_LINGOTE = 0.325;
TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES = PlataformaCatapulta.ANCHO * 0.8;
TravesañoDelantero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_DELANTERO = (PlataformaCatapulta.LARGO / 2) - (PlataformaCatapulta.LARGO_EXCEDENTE + (Rueda.RADIO * 2) + TravesañoDelantero.ANCHO_INF_LINGOTES / 2)
EjeTravesañoDelantero.RADIO_EJE = (TravesañoDelantero.ANCHO_SUP_LINGOTES * 0.7) / 2;
EjeTravesañoDelantero.LARGO_EXCEDENTE_EJE = 0.2;
EjeTravesañoDelantero.LARGO_EJE = TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES + EjeTravesañoDelantero.LARGO_EXCEDENTE_EJE + TravesañoDelantero.LARGO_LINGOTE;
EjeTravesañoDelantero.DISTANCIA_EJE_A_BORDE_SUPERIOR = 0.15;
EjeTravesañoDelantero.ALTURA_EJE = TravesañoDelantero.ALTURA_LINGOTES - (EjeTravesañoDelantero.RADIO_EJE + EjeTravesañoDelantero.DISTANCIA_EJE_A_BORDE_SUPERIOR);

TravesañoTrasero.ANCHO_INF_LINGOTES = Rueda.RADIO * 1.1;
TravesañoTrasero.ANCHO_SUP_LINGOTES = TravesañoTrasero.ANCHO_INF_LINGOTES / 2.5;
TravesañoTrasero.ALTURA_LINGOTES = TravesañoDelantero.ALTURA_LINGOTES / 3;
TravesañoTrasero.LARGO_LINGOTE = TravesañoDelantero.LARGO_LINGOTE / 2;
TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES = PlataformaCatapulta.ANCHO * 0.3;
TravesañoTrasero.DISTANCIA_AL_BORDE_DE_PLATAFORMA = PlataformaCatapulta.LARGO * 0.01;
TravesañoTrasero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_TRASERO = (PlataformaCatapulta.LARGO / 2) - ((TravesañoTrasero.ANCHO_INF_LINGOTES / 2) + TravesañoTrasero.DISTANCIA_AL_BORDE_DE_PLATAFORMA);
EjeTravesañoTrasero.RADIO_EJE = (TravesañoTrasero.ANCHO_SUP_LINGOTES * 0.9) / 2;
EjeTravesañoTrasero.LARGO_EXCEDENTE_EJE = 1;
EjeTravesañoTrasero.LARGO_EJE = TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES + EjeTravesañoTrasero.LARGO_EXCEDENTE_EJE;
EjeTravesañoTrasero.ALTURA_EJE = TravesañoTrasero.ALTURA_LINGOTES - (3 * EjeTravesañoTrasero.RADIO_EJE);
ContraEjeTravesañoTrasero.LARGO_EXCEDENTE_CONTRAEJE = 0.5;
ContraEjeTravesañoTrasero.LARGO_CONTRAEJES = 2 * EjeTravesañoTrasero.RADIO_EJE + ContraEjeTravesañoTrasero.LARGO_EXCEDENTE_CONTRAEJE;
ContraEjeTravesañoTrasero.RADIO_CONTRAEJES = 0.2 * EjeTravesañoTrasero.RADIO_EJE;
ContraEjeTravesañoTrasero.DISTANCIA_BORDE_CONTRAEJE = 0.2
ContraEjeTravesañoTrasero.DISTANCIA_CENTRO_A_CONTRAEJES = EjeTravesañoTrasero.LARGO_EJE / 2 - ContraEjeTravesañoTrasero.DISTANCIA_BORDE_CONTRAEJE;
Ovillo.RADIO = EjeTravesañoTrasero.RADIO_EJE * 2;
Ovillo.ANCHO = TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES * 0.3;

CucharaCatapulta.ESPESOR = EjeTravesañoDelantero.RADIO_EJE + EjeTravesañoDelantero.DISTANCIA_EJE_A_BORDE_SUPERIOR;
CucharaCatapulta.LARGO_EXCEDENTE_A_PLATAFORMA = PlataformaCatapulta.LARGO * 0.2
CucharaCatapulta.LARGO_MANGO = PlataformaCatapulta.LARGO + CucharaCatapulta.LARGO_EXCEDENTE_A_PLATAFORMA;
CucharaCatapulta.ANCHO_MANGO = TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES * 0.3
CucharaCatapulta.LARGO_CUADRADO_CUCHARA = TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES;
CucharaCatapulta.DESPLAZAMIENTO_CUCHARA_SOBRE_EJE = (CucharaCatapulta.LARGO_MANGO / 2) - ((PlataformaCatapulta.LARGO / 2) - TravesañoDelantero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_DELANTERO);
CucharaCatapulta.RADIO_OVILLO = Math.sqrt(Math.pow(CucharaCatapulta.ANCHO_MANGO / 2, 2) + Math.pow(CucharaCatapulta.ESPESOR / 2, 2))
CucharaCatapulta.ANCHO_OVILLO = CucharaCatapulta.ANCHO_MANGO / 2;
CucharaCatapulta.DISTANCIA_ENTRE_EJES_DE_TRAVESAÑOS = TravesañoDelantero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_DELANTERO + TravesañoTrasero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_TRASERO
CucharaCatapulta.DISTANCIA_EJE_CONTRAPESO_A_BORDE_CUCHARA = 0.2;
CucharaCatapulta.DISTANCIA_EJE_CONTRAPESO_A_EJE_CUCHARA = (CucharaCatapulta.LARGO_MANGO / 2) - CucharaCatapulta.DESPLAZAMIENTO_CUCHARA_SOBRE_EJE - CucharaCatapulta.DISTANCIA_EJE_CONTRAPESO_A_BORDE_CUCHARA
ContrapesoCuchara.ANCHO_INF_LINGOTES = TravesañoTrasero.ANCHO_INF_LINGOTES * 0.7;
ContrapesoCuchara.ANCHO_SUP_LINGOTES = ContrapesoCuchara.ANCHO_INF_LINGOTES / 2.5;
ContrapesoCuchara.ALTURA_LINGOTES = CucharaCatapulta.ESPESOR + EjeTravesañoDelantero.RADIO_EJE;
ContrapesoCuchara.LARGO_LINGOTE = TravesañoTrasero.LARGO_LINGOTE;
ContrapesoCuchara.ANCHO_EXCEDENTE_LINGOTES = 0.4;
ContrapesoCuchara.DISTANCIA_ENTRE_LINGOTES = CucharaCatapulta.ANCHO_MANGO + ContrapesoCuchara.ANCHO_EXCEDENTE_LINGOTES;
ContrapesoCuchara.RADIO_EJE = CucharaCatapulta.ESPESOR / 5;
ContrapesoCuchara.LARGO_EXCEDENTE_EJE = 0.4;
ContrapesoCuchara.DISTANCIA_EJE_A_BORDE_LINGOTE = 0.1;
ContrapesoCuchara.LARGO_EJE = ContrapesoCuchara.DISTANCIA_ENTRE_LINGOTES + ContrapesoCuchara.LARGO_EXCEDENTE_EJE;
ContrapesoCuchara.EXCEDENTE_ENTRE_CUBO_CONTRAPESO_Y_LINGOTES = 0.3;
ContrapesoCuchara.LADO_CUBO_CONTRAPESO = ContrapesoCuchara.DISTANCIA_ENTRE_LINGOTES + ContrapesoCuchara.EXCEDENTE_ENTRE_CUBO_CONTRAPESO_Y_LINGOTES;

Hilo.RADIO = 0.025;


export default Catapulta
