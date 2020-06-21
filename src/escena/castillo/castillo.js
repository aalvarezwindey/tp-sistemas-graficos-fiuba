import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';
import { Vertice } from '../../geometria/superficie_barrido/poligono.js';

class TechoCastillo extends Objeto3D {
  constructor(largoPiso, anchoPiso) {
    super();

    this.techo = new Prisma(
      DivisorDePisos.LARGO(largoPiso, anchoPiso),
      DivisorDePisos.ANCHO(largoPiso, anchoPiso),
      TechoCastillo.ALTURA,
      MATERIAL_LOZA_AZUL,
      (vertice, nivel) => {
        const verticeTransformado = vertice.clone();

        // En el nivel final debimos haber reducido un 99% su largo original
        verticeTransformado.posicion[0] = vertice.posicion[0] - (nivel * TechoCastillo.LARGO_PORCENTUAL_FINAL_DISMINUIDO * vertice.posicion[0])

        // En el nivel final debimos haber reducido un 50% su ancho original
        verticeTransformado.posicion[1] = vertice.posicion[1] - (nivel * TechoCastillo.ANCHO_PORCENTUAL_FINAL_DISMINUIDO * vertice.posicion[1])

        return verticeTransformado;
      }
    );
    //this.techo.setRotation(0, 0, Math.PI / 2);

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
    //this.divisor.setRotation(0, 0, Math.PI / 2);
    this.addChild(this.divisor);
  }
}

class Piso extends Objeto3D {
  constructor(largo, ancho, ultimo) {
    super();

    this.piso = new Prisma(largo, ancho, Piso.ALTURA, MATERIAL_BEIGE);

    if (!ultimo) {
      const divisor = new DivisorDePisos(largo, ancho);
      divisor.setPosition(Piso.ALTURA / 2, 0, 0);
      this.piso.addChild(divisor);
    } else {
      const techo = new TechoCastillo(largo, ancho);
      techo.setPosition((Piso.ALTURA / 2) + (TechoCastillo.ALTURA / 2), 0, 0);
      this.piso.addChild(techo);
    }

    this.piso.setRotation(0, 0, Math.PI / 2);
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
      piso.setPosition(0, (Piso.ALTURA / 2) + Piso.ALTURA * i, 0);
      this.pisos.push(piso);
      this.addChild(piso);
    }
  }
}

Castillo.CANTIDAD_DE_PISOS_DEFAULT = 3;

Piso.LARGO_DEFAULT = 5;
Piso.ANCHO_DEFAULT = 10;
Piso.ALTURA = 3;

DivisorDePisos.EXCEDENTE = (largoPiso, anchoPiso) => Math.max(largoPiso, anchoPiso) * 0.02;
DivisorDePisos.LARGO = (largoPiso, anchoPiso) => largoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ANCHO = (largoPiso, anchoPiso) => anchoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ALTURA = 0.05 * Piso.ALTURA;

TechoCastillo.ALTURA = Piso.ALTURA * 0.95;
TechoCastillo.LARGO_PORCENTUAL_FINAL_DISMINUIDO = 0.95;
TechoCastillo.ANCHO_PORCENTUAL_FINAL_DISMINUIDO = 0.40;


export default Castillo;