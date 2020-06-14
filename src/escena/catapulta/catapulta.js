import Objeto3D from '../../geometria/objeto_3d.js'
import Recta from '../../geometria/superficie_barrido/recorridos_parametricos/recta.js';
import DefaultMaterial from '../../material/types/default_material.js';
import SuperficieBarrido from '../../geometria/superficie_barrido/superficie_barrido.js';
import Circulo from '../../geometria/superficie_barrido/poligonos/circulo.js';
import Cilindro from '../../geometria/objetos_3d/cilindro.js';
import Prisma from '../../geometria/objetos_3d/prisma.js';


class Rueda extends Objeto3D {
  constructor() {
    super();

    // Creates geometria only the first time
    Rueda.cilindro = Rueda.cilindro || new Cilindro(Rueda.RADIO, Rueda.ANCHO);

    this.addChild(Rueda.cilindro);
  }
}

Rueda.ANCHO = 0.2;
Rueda.RADIO = 1;

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

EjeDeRuedas.LARGO = 6;
EjeDeRuedas.RADIO_EJE = 0.1;

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

TrenDeRuedas.ENCASTRE = 0.08

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

Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS = 8;

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
  }
}

PlataformaCatapulta.ANCHO = EjeDeRuedas.LARGO - (TrenDeRuedas.ENCASTRE * 2) - (Rueda.ANCHO * 2)
PlataformaCatapulta.LARGO_EXCEDENTE = 0.2;
PlataformaCatapulta.LARGO = Catapulta.DISTANCIA_ENTRE_TRENES_DE_RUEDAS + (Rueda.RADIO * 2) + PlataformaCatapulta.LARGO_EXCEDENTE;
PlataformaCatapulta.ESPESOR = 0.35;

export default Catapulta
