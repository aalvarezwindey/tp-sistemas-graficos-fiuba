import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';
import Ventana from '../../geometria/objetos_3d/ventana.js';
import SuperficieBarrido from '../../geometria/superficie_barrido/superficie_barrido.js';
import PerfilTorre from '../../geometria/superficie_barrido/poligonos/perfil_torre.js';
import Circunferencia from '../../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js';
import PerfilTechoTorre from '../../geometria/superficie_barrido/poligonos/perfil_techo_torre.js';

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
    const d_ventanas_a_borde = VentanaCastillo.DISTANCIA_VENTANAS_AL_BORDE;
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
    const d_ventanas_a_borde = VentanaCastillo.DISTANCIA_VENTANAS_AL_BORDE;
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

class TorreCastillo extends Objeto3D {
  constructor(alturaDeLosPisos, cantidadDePisos) {
    super();

    if (alturaDeLosPisos !== TorreCastillo.alturaDeLosPisos || cantidadDePisos !== TorreCastillo.cantidadDePisos) {
      TorreCastillo.alturaDeLosPisos = alturaDeLosPisos;
      TorreCastillo.cantidadDePisos = cantidadDePisos;

      const alturaInferior = ((TorreCastillo.cantidadDePisos - 1) + TorreCastillo.EXCEDENTE_PORCENTUAL_RESPECTO_ALTURA_PISO_PARA_ALTURA_INFERIOR) * TorreCastillo.alturaDeLosPisos 
      const alturaSuperior = TorreCastillo.alturaDeLosPisos;
      TorreCastillo.altura = alturaInferior + alturaSuperior + TorreCastillo.ALTURA_CURVA;

      // Volvemos a setear la geometria
      TorreCastillo.geometria = new SuperficieBarrido(
        new PerfilTorre({ 
          alturaInferior: alturaInferior,
          radioInferior: TorreCastillo.RADIO_INFERIOR, 
          alturaSuperior: alturaSuperior, 
          radioSuperior: TorreCastillo.RADIO_SUPERIOR,
          alturaCurva: TorreCastillo.ALTURA_CURVA
        }), 
        // Para hacer una revolucion hacemos un barrido en una circunferencia de R -> 0
        new Circunferencia(0.01), 
        false
      );

      TorreCastillo.geometriaTecho = new SuperficieBarrido(
        new PerfilTechoTorre(TorreCastillo.RADIO_TECHO, TorreCastillo.ALTURA_TECHO),
        new Circunferencia(0.01),
        false
      )
    }

    this.torre = new Objeto3D({
      geometry: TorreCastillo.geometria,
      material: MATERIAL_BEIGE,
      glContext: gl
    });

    this.techoTorre = new Objeto3D({
      geometry: TorreCastillo.geometriaTecho,
      material: MATERIAL_LOZA_AZUL,
      glContext: gl
    });

    this.techoTorre.setPosition(0, 0, TorreCastillo.altura);

    this.torre.setRotation(-Math.PI / 2, 0, 0);
    this.torre.addChild(this.techoTorre);

    this.addChild(this.torre);
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

    // Pisos
    for (let i = 0 ; i < this.cantidadDePisos ; i++) {
      const ultimo = i === this.cantidadDePisos - 1;
      const piso = new Piso(largo, ancho, ultimo);
      piso.setPosition(0, (Piso.ALTURA / 2) + Piso.ALTURA * i, 0);
      this.pisos.push(piso);
      this.addChild(piso);
    }

    // Torres
    const torre1 = new TorreCastillo(Piso.ALTURA, this.cantidadDePisos);
    const torre2 = new TorreCastillo(Piso.ALTURA, this.cantidadDePisos);
    const torre3 = new TorreCastillo(Piso.ALTURA, this.cantidadDePisos);
    const torre4 = new TorreCastillo(Piso.ALTURA, this.cantidadDePisos);

    torre1.setPosition(this.largo / 2, 0, this.ancho / 2);
    torre2.setPosition(this.largo / 2, 0, -this.ancho / 2);
    torre3.setPosition(-this.largo / 2, 0, this.ancho / 2);
    torre4.setPosition(-this.largo / 2, 0, -this.ancho / 2);

    this.addChild(torre1);
    this.addChild(torre2);
    this.addChild(torre3);
    this.addChild(torre4);
  }

  variarPisos = () => {
    let cantidadDePisosNueva = this.cantidadDePisos + 1;
    if (cantidadDePisosNueva > this.MAX_CANTIDAD_PISOS) {
      cantidadDePisosNueva = this.MIN_CANTIDAD_PISOS;
    }

    this._init(cantidadDePisosNueva, this.largo, this.ancho)
  }

  variarLargo = () => {
    let nuevoLargo = this.largo + 1;
    if (nuevoLargo > this.MAX_LARGO) {
      nuevoLargo = this.MIN_LARGO;
    }

    this._init(this.cantidadDePisos, nuevoLargo, this.ancho)
  }

  variarAncho = () => {
    let nuevoAncho = this.ancho + 1;
    if (nuevoAncho > this.MAX_ANCHO) {
      nuevoAncho = this.MIN_ANCHO;
    }

    this._init(this.cantidadDePisos, this.largo, nuevoAncho);
  }
}

Castillo.CANTIDAD_DE_PISOS_DEFAULT = 3;

Piso.LARGO_DEFAULT = 5;
Piso.ANCHO_DEFAULT = 10;
Piso.ALTURA = 3;

TechoCastillo.ALTURA = Piso.ALTURA * 1.2;
TechoCastillo.LARGO_PORCENTUAL_FINAL_DISMINUIDO = 0.95;
TechoCastillo.ANCHO_PORCENTUAL_FINAL_DISMINUIDO = 0.40;

TorreCastillo.RADIO_INFERIOR = 0.8;
TorreCastillo.RADIO_SUPERIOR = 1.2;
TorreCastillo.ALTURA_CURVA = 2;
TorreCastillo.EXCEDENTE_PORCENTUAL_RESPECTO_ALTURA_PISO_PARA_ALTURA_INFERIOR = 0.0;
TorreCastillo.RADIO_TECHO = TorreCastillo.RADIO_SUPERIOR * 1.1;
TorreCastillo.ALTURA_TECHO = TechoCastillo.ALTURA * 0.9

VentanaCastillo.BASE = 0.6;
VentanaCastillo.ALTURA = Piso.ALTURA * 0.20;
VentanaCastillo.PRFUNDIDAD = 0.2;
VentanaCastillo.MIN_DISTANCIA_ENTRE_VENTANAS = 0.8;
VentanaCastillo.DISTANCIA_VENTANAS_AL_BORDE = TorreCastillo.RADIO_SUPERIOR * 1.2;

DivisorDePisos.EXCEDENTE = (largoPiso, anchoPiso) => Math.max(largoPiso, anchoPiso) * 0.02;
DivisorDePisos.LARGO = (largoPiso, anchoPiso) => largoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ANCHO = (largoPiso, anchoPiso) => anchoPiso + DivisorDePisos.EXCEDENTE(largoPiso, anchoPiso);
DivisorDePisos.ALTURA = 0.05 * Piso.ALTURA;

export default Castillo;