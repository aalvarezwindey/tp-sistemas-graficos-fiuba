import Objeto3D from '../../geometria/objeto_3d.js'
import Cilindro from '../../geometria/objetos_3d/cilindro.js';
import Prisma from '../../geometria/objetos_3d/prisma.js';
import Lingote from '../../geometria/objetos_3d/lingote.js';


class Rueda extends Objeto3D {
  constructor() {
    super();

    // Creates geometria only the first time
    Rueda.cilindro = Rueda.cilindro || new Cilindro(Rueda.RADIO, Rueda.ANCHO);

    this.addChild(Rueda.cilindro);
  }
}



class EjeDeRuedas extends Objeto3D {
  LARGO = 8;
  RADIO_EJE = 0.1;

  constructor() {
    super();

    // Creates geometria only the first time
    EjeDeRuedas.cilindro = EjeDeRuedas.cilindro || new Cilindro(EjeDeRuedas.RADIO_EJE, EjeDeRuedas.LARGO);

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
      new Prisma(PlataformaCatapulta.LARGO, PlataformaCatapulta.ANCHO, PlataformaCatapulta.ESPESOR)
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
      TravesañoDelantero.LARGO_LINGOTE
    );
    lingoteIzquierdo.setRotation(-Math.PI / 2, 0, 0);
    lingoteIzquierdo.setPosition(-TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES / 2, 0, 0);

    sistemaDeReferencia.addChild(lingoteIzquierdo);

    const lingoteDerecho = new Lingote(
      TravesañoDelantero.ANCHO_INF_LINGOTES,
      TravesañoDelantero.ANCHO_SUP_LINGOTES,
      TravesañoDelantero.ALTURA_LINGOTES,
      TravesañoDelantero.LARGO_LINGOTE
    );
    lingoteDerecho.setRotation(-Math.PI / 2, 0, 0);
    lingoteDerecho.setPosition(TravesañoDelantero.DISTANCIA_ENTRE_LINGOTES / 2, 0, 0);

    sistemaDeReferencia.addChild(lingoteDerecho);

    sistemaDeReferencia.setPosition(0, TravesañoDelantero.ALTURA_LINGOTES / 2, 0)

    this.addChild(sistemaDeReferencia);
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
      TravesañoTrasero.LARGO_LINGOTE
    );
    lingoteIzquierdo.setRotation(-Math.PI / 2, 0, 0);
    lingoteIzquierdo.setPosition(-TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES / 2, 0, 0);

    sistemaDeReferencia.addChild(lingoteIzquierdo);

    const lingoteDerecho = new Lingote(
      TravesañoTrasero.ANCHO_INF_LINGOTES,
      TravesañoTrasero.ANCHO_SUP_LINGOTES,
      TravesañoTrasero.ALTURA_LINGOTES,
      TravesañoTrasero.LARGO_LINGOTE
    );
    lingoteDerecho.setRotation(-Math.PI / 2, 0, 0);
    lingoteDerecho.setPosition(TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES / 2, 0, 0);

    sistemaDeReferencia.addChild(lingoteDerecho);

    sistemaDeReferencia.setPosition(0, TravesañoTrasero.ALTURA_LINGOTES / 2, 0)

    this.addChild(sistemaDeReferencia);
  }
}

class Catapulta extends Objeto3D {
  constructor() {
    super();
    const trenDelantero = new TrenDeRuedas();
    const trenTrasero = new TrenDeRuedas();
    const plataforma = new PlataformaCatapulta();

    trenDelantero.setPosition(0, 0, - Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS / 2);
    trenTrasero.setPosition(0, 0, + Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS / 2);

    this.addChild(trenDelantero);
    this.addChild(trenTrasero);
    this.addChild(plataforma);
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

TravesañoTrasero.ANCHO_INF_LINGOTES = Rueda.RADIO;
TravesañoTrasero.ANCHO_SUP_LINGOTES = TravesañoTrasero.ANCHO_INF_LINGOTES / 2.5;
TravesañoTrasero.ALTURA_LINGOTES = TravesañoDelantero.ALTURA_LINGOTES / 3;
TravesañoTrasero.LARGO_LINGOTE = TravesañoDelantero.LARGO_LINGOTE / 2;
TravesañoTrasero.DISTANCIA_ENTRE_LINGOTES = PlataformaCatapulta.ANCHO * 0.3;
TravesañoTrasero.DISTANCIA_AL_BORDE_DE_PLATAFORMA = PlataformaCatapulta.LARGO * 0.01;
TravesañoTrasero.DIST_CENTRO_PLATAFORMA_A_EJE_TRAVESAÑO_TRASERO = (PlataformaCatapulta.LARGO / 2) - ((TravesañoTrasero.ANCHO_INF_LINGOTES / 2) + TravesañoTrasero.DISTANCIA_AL_BORDE_DE_PLATAFORMA);

export default Catapulta
