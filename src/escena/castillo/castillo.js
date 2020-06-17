import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';

class DivisorDePisos extends Objeto3D {
  constructor() {
    super()

    this.divisor = new Prisma(DivisorDePisos.LARGO, DivisorDePisos.ANCHO, DivisorDePisos.ALTURA);
    this.divisor.setRotation(0, 0, Math.PI / 2);
    this.addChild(this.divisor);
  }
}

class Piso extends Objeto3D {
  constructor(ultimo) {
    super();

    this.piso = new Prisma(Piso.LARGO, Piso.ANCHO, Piso.ALTURA);

    if (!ultimo) {
      const divisor = new DivisorDePisos();
      divisor.setPosition(0, Piso.ALTURA / 2, 0);
      this.piso.addChild(divisor);
    }

    this.addChild(this.piso);
  }
}

class Castillo extends Objeto3D {
  constructor() {
    super();
    this.cantidadDePisos = 5;
    this.pisos = [];

    for (let i = 0 ; i < this.cantidadDePisos ; i++) {
      const ultimo = i === this.cantidadDePisos - 1;
      const piso = new Piso();
      piso.setPosition(0, (Piso.ALTURA / 2) * (i + 1), 0);
      this.pisos.push(piso);
      this.addChild(piso);
    }
  }
}

Piso.LARGO = 5;
Piso.ANCHO = 10;
Piso.ALTURA = 5;

DivisorDePisos.EXCEDENTE = Math.max(Piso.LARGO, Piso.ANCHO) * 0.5;
DivisorDePisos.LARGO = Piso.LARGO + DivisorDePisos.EXCEDENTE;
DivisorDePisos.ANCHO = Piso.ANCHO + DivisorDePisos.EXCEDENTE;
DivisorDePisos.ALTURA = 0.3;


export default Castillo;