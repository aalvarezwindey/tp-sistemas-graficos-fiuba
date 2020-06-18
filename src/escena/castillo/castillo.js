import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';

class TechoCastillo extends Objeto3D {
  constructor(largoPiso, anchoPiso) {
    super();

    this.techo = new Prisma(
      DivisorDePisos.LARGO(largoPiso, anchoPiso),
      DivisorDePisos.ANCHO(largoPiso, anchoPiso),
      TechoCastillo.ALTURA,
      MATERIAL_LOZA_AZUL
    );
    this.techo.setRotation(0, 0, Math.PI / 2);

    this.addChild(this.techo);
  }
}

class DivisorDePisos extends Objeto3D {
  constructor(largoPiso, anchoPiso) {
    super()

    this.divisor = new Prisma(
      DivisorDePisos.LARGO(largoPiso, anchoPiso),
      DivisorDePisos.ANCHO(largoPiso, anchoPiso),
      DivisorDePisos.ALTURA,
      MATERIAL_BEIGE
    );
    this.divisor.setRotation(0, 0, Math.PI / 2);
    this.addChild(this.divisor);
  }
}

class Piso extends Objeto3D {
  constructor(largo, ancho, ultimo) {
    super();

    this.piso = new Prisma(largo, ancho, Piso.ALTURA, MATERIAL_BEIGE);

    if (!ultimo) {
      const divisor = new DivisorDePisos(largo, ancho);
      divisor.setPosition(0, Piso.ALTURA / 2, 0);
      this.piso.addChild(divisor);
    } else {
      const techo = new TechoCastillo(largo, ancho);
      techo.setPosition(0, Piso.ALTURA / 2 + TechoCastillo.ALTURA / 2, 0);
      this.piso.addChild(techo);
    }

    this.addChild(this.piso);
  }
}

class Castillo extends Objeto3D {
  constructor(pisos = Castillo.CANTIDAD_DE_PISOS_DEFAULT, largo = Piso.LARGO_DEFAULT, ancho = Piso.ANCHO_DEFAULT) {
    super();
    this.cantidadDePisos = pisos;
    this.pisos = [];

    for (let i = 0 ; i < this.cantidadDePisos ; i++) {
      const ultimo = i === this.cantidadDePisos - 1;
      const piso = new Piso(largo, ancho, ultimo);
      piso.setPosition(0, Piso.ALTURA / 2 + Piso.ALTURA * i, 0);
      this.pisos.push(piso);
      this.addChild(piso);
    }
  }
}

Castillo.CANTIDAD_DE_PISOS_DEFAULT = 3;

Piso.LARGO_DEFAULT = 5;
Piso.ANCHO_DEFAULT = 10;
Piso.ALTURA = 5;

DivisorDePisos.EXCEDENTE = (largoPiso, anchoPiso) => Math.max(largoPiso, anchoPiso) * 0.02;
DivisorDePisos.LARGO = (largoPiso, anchoPiso) => largoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ANCHO = (largoPiso, anchoPiso) => anchoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ALTURA = 0.2;

TechoCastillo.ALTURA = Piso.ALTURA;


export default Castillo;