import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';
import { Vertice } from '../../geometria/superficie_barrido/poligono.js';
import Ventana from '../../geometria/objetos_3d/ventana.js';

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

    this.addChild(this.divisor);
  }
}

class VentanaCastillo extends Objeto3D {
  constructor() {
    super();

    this.ventana = new Ventana(VentanaCastillo.BASE, VentanaCastillo.ALTURA, VentanaCastillo.PRFUNDIDAD);

    this.ventana.setRotation(0, Math.PI / 2, -Math.PI / 2);

    this.addChild(this.ventana)
  }
}

class Piso extends Objeto3D {
  constructor(largo, ancho, ultimo) {
    super();

    this.ancho = ancho;
    this.largo = largo;
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

    this._ubicarVentanasALoAncho();
    this._ubicarVentanasALoLargo()

    this.addChild(this.piso);
  }

  _ubicarVentanasALoLargo = () => {
    const min_d_ventanas = VentanaCastillo.MIN_DISTANCIA_ENTRE_VENTANAS 
    const base_ventana = VentanaCastillo.BASE
    const d_ventanas_a_borde = VentanaCastillo.BASE * 2;
    const long_disponible = this.largo - (2 * d_ventanas_a_borde);
    const cantidadDeVentanasEnLargo = Math.floor(long_disponible / (base_ventana + (min_d_ventanas / 2)));
    const d_entre_ventanas = (long_disponible - (cantidadDeVentanasEnLargo * base_ventana)) / (cantidadDeVentanasEnLargo - 1);

    for (let i = 0; i < cantidadDeVentanasEnLargo; i++) {
      const ventana1 = new VentanaCastillo();
      ventana1.setRotation(Math.PI / 2, 0, 0);
      ventana1.setPosition(
        0,
        ((-this.largo / 2) + d_ventanas_a_borde) + (base_ventana / 2) + i * (base_ventana + d_entre_ventanas),
        this.ancho / 2
      );

      const ventana2 = new VentanaCastillo();
      ventana2.setRotation(Math.PI / 2, 0, 0);
      ventana2.setPosition(
        0, 
        (-this.largo / 2) + d_ventanas_a_borde + (base_ventana / 2) + i * (base_ventana + d_entre_ventanas), 
        -this.ancho / 2
      );

      this.piso.addChild(ventana1)
      this.piso.addChild(ventana2)
    }
  }

  _ubicarVentanasALoAncho = () => {
    const min_d_ventanas = VentanaCastillo.MIN_DISTANCIA_ENTRE_VENTANAS 
    const base_ventana = VentanaCastillo.BASE
    const d_ventanas_a_borde = VentanaCastillo.BASE * 2;
    const long_disponible = this.ancho - (2 * d_ventanas_a_borde);
    const cantidadDeVentanasEnAncho = Math.floor(long_disponible / (base_ventana + (min_d_ventanas / 2)));
    const d_entre_ventanas = (long_disponible - (cantidadDeVentanasEnAncho * base_ventana)) / (cantidadDeVentanasEnAncho - 1);

    for (let i = 0; i < cantidadDeVentanasEnAncho; i++) {
      const ventana = new VentanaCastillo();
      ventana.setPosition(0, this.largo / 2, 0);
      
      const ventana1 = new VentanaCastillo();
      ventana1.setPosition(
        0,
        this.largo / 2,
        ((-this.ancho / 2) + d_ventanas_a_borde) + (base_ventana / 2) + i * (base_ventana + d_entre_ventanas)
      );

      const ventana2 = new VentanaCastillo();
      ventana2.setPosition(
        0, 
        -this.largo / 2,
        (-this.ancho / 2) + d_ventanas_a_borde + (base_ventana / 2) + i * (base_ventana + d_entre_ventanas)
      );

      this.piso.addChild(ventana1)
      this.piso.addChild(ventana2)
    }
  }
}

class Castillo extends Objeto3D {
  MAX_LARGO = 10;
  MIN_LARGO = 3;

  MAX_ANCHO = 20;
  MIN_ANCHO = 10;

  MAX_CANTIDAD_PISOS = 8;
  MIN_CANTIDAD_PISOS = 1;

  constructor(pisos = Castillo.CANTIDAD_DE_PISOS_DEFAULT, largo = Piso.LARGO_DEFAULT, ancho = Piso.ANCHO_DEFAULT) {
    super();
    this._init(pisos, largo, ancho)
  }

  _init(pisos, largo, ancho) {
    this.cantidadDePisos = pisos;
    this.pisos = [];
    this.largo = largo;
    this.ancho = ancho;

    for (let i = 0 ; i < this.cantidadDePisos ; i++) {
      const ultimo = i === this.cantidadDePisos - 1;
      const piso = new Piso(largo, ancho, ultimo);
      piso.setPosition(0, (Piso.ALTURA / 2) + Piso.ALTURA * i, 0);
      this.pisos.push(piso);
      this.addChild(piso);
    }
  }

  variarPisos = () => {
    const cantidadDePisosNueva = ((this.pisos + 1) % this.MAX_CANTIDAD_PISOS) + this.MIN_CANTIDAD_PISOS
    this._init(cantidadDePisosNueva, this.largo, this.ancho)
  }

  variarLargo = () => {
    const nuevoLargo = ((this.largo + 1) % this.MAX_LARGO) + this.MIN_LARGO;
    this._init(this.cantidadDePisos, nuevoLargo, this.ancho)
  }

  variarAncho = () => {
    const nuevoAncho = ((this.ancho + 1) % this.MAX_ANCHO) + this.MIN_ANCHO
    this._init(this.cantidadDePisos, this.largo, nuevoAncho);
  }
}

Castillo.CANTIDAD_DE_PISOS_DEFAULT = 3;

Piso.LARGO_DEFAULT = 5;
Piso.ANCHO_DEFAULT = 10;
Piso.ALTURA = 3;

VentanaCastillo.BASE = 0.6;
VentanaCastillo.ALTURA = Piso.ALTURA * 0.20;
VentanaCastillo.PRFUNDIDAD = 0.2;
VentanaCastillo.MIN_DISTANCIA_ENTRE_VENTANAS = 0.8

DivisorDePisos.EXCEDENTE = (largoPiso, anchoPiso) => Math.max(largoPiso, anchoPiso) * 0.02;
DivisorDePisos.LARGO = (largoPiso, anchoPiso) => largoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ANCHO = (largoPiso, anchoPiso) => anchoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ALTURA = 0.05 * Piso.ALTURA;

TechoCastillo.ALTURA = Piso.ALTURA * 0.95;
TechoCastillo.LARGO_PORCENTUAL_FINAL_DISMINUIDO = 0.95;
TechoCastillo.ANCHO_PORCENTUAL_FINAL_DISMINUIDO = 0.40;


export default Castillo;