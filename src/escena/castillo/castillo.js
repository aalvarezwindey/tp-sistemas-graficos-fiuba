import Objeto3D from '../../geometria/objeto_3d.js'
import Prisma from '../../geometria/objetos_3d/prisma.js';
import Ventana from '../../geometria/objetos_3d/ventana.js';
import SuperficieBarrido from '../../geometria/superficie_barrido/superficie_barrido.js';
import PerfilTorre from '../../geometria/superficie_barrido/poligonos/perfil_torre.js';
import Circunferencia from '../../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js';
import PerfilTechoTorre from '../../geometria/superficie_barrido/poligonos/perfil_techo_torre.js';
import PerfilMuralla from '../../geometria/superficie_barrido/poligonos/perfil_muralla.js';
import Rectangulo from '../../geometria/superficie_barrido/poligonos/rectangulo.js';
import PerfilTorreMuralla from '../../geometria/superficie_barrido/poligonos/perfil_torre_muralla.js';

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

class TorreMuralla extends Objeto3D {
  constructor(radioTorre, alturaTorre) {
    super();

    if (radioTorre !== TorreMuralla.radioTorre || alturaTorre !== TorreMuralla.alturaTorre) {
      TorreMuralla.radioTorre = radioTorre;
      TorreMuralla.alturaTorre = alturaTorre;

      // Volvemos a setear la geometria
      TorreMuralla.geometriaTorre = new SuperficieBarrido(
        new PerfilTorreMuralla(radioTorre, alturaTorre),
        new Circunferencia(0.01),
        false
      );

      TorreMuralla.geometriaToroide = new SuperficieBarrido(
        new Rectangulo(TorreMuralla.ANCHO_TOROIDE, TorreMuralla.ALTO_TOROIDE),
        new Circunferencia(TorreMuralla.radioTorre - TorreMuralla.ANCHO_TOROIDE / 2),
        false
      )
    }

    this.torre = new Objeto3D({
      geometry: TorreMuralla.geometriaTorre,
      material: MATERIAL_PIEDRA,
      glContext: gl
    });

    this.toroideRectangular = new Objeto3D({
      geometry: TorreMuralla.geometriaToroide,
      material: MATERIAL_PIEDRA,
      glContext: gl
    });
    this.toroideRectangular.setPosition(0, 0, alturaTorre + (TorreMuralla.ALTO_TOROIDE / 2));
    this.torre.addChild(this.toroideRectangular); 

    this.addChild(this.torre);
  }
}

class Muralla extends Objeto3D {
  constructor(radio, cantidadDeLados, altura) {
    super();

    this.muralla = new Objeto3D({
      geometry: new SuperficieBarrido(new PerfilMuralla(altura, Muralla.ANCHO), new Circunferencia(radio, 0.1), false, cantidadDeLados - 1),
      material: MATERIAL_PIEDRA,
      glContext: gl
    });
    this.muralla.setRotation(-Math.PI / 2, 0, 0);

    // torres
    for (let i = 0; i < cantidadDeLados; i++) {
      const torreMuralla = new TorreMuralla(TorreMuralla.RADIO, altura + altura * TorreMuralla.ALTURA_EXCEDENTE_PORCENTUAL);
      const anguloDeRotacion = i * (2 * Math.PI / cantidadDeLados);
      torreMuralla.setPosition(radio * Math.cos(anguloDeRotacion), radio * Math.sin(anguloDeRotacion), 0);
      this.muralla.addChild(torreMuralla);
    }

    // puerta
    const ANCHO_MARCO = (Math.PI / 8) * radio / 2;
    const ALTO_MARCO = altura * 1.2;
    const PROFUNDIDAD_MARCO = Muralla.ANCHO * 1.2;

    const ANCHO_PUERTA = ANCHO_MARCO * 0.9;
    const ALTO_PUERTA = ALTO_MARCO * 0.95;
    const PROFUNDIDAD_PUERTA = PROFUNDIDAD_MARCO * 1.1;

    this.marcoPuerta = new Prisma(ANCHO_MARCO, ALTO_MARCO, PROFUNDIDAD_MARCO, MATERIAL_PIEDRA);
    this.puerta = new Prisma(ANCHO_PUERTA, ALTO_PUERTA, PROFUNDIDAD_PUERTA, MATERIAL_MADERA_CLARA);
    this.puerta.setPosition(0, 0, -(ALTO_MARCO - ALTO_PUERTA) / 2);
    this.marcoPuerta.addChild(this.puerta);

    // giro para que un lado apunte al puente
    const giro = (2 * Math.PI / cantidadDeLados) / 2;
    this.setRotation(0, giro, 0);

    this.marcoPuerta.setRotation(0, 0, -giro);

    // Calculamos XY de la puerta, en base al punto medio entre la torre0 y la ultima torre
    const x0 = radio;
    const y0 = 0;
    const xn = radio * Math.cos((cantidadDeLados - 1) * Math.PI * 2 / cantidadDeLados);
    const yn = radio * Math.sin((cantidadDeLados - 1) * Math.PI * 2 / cantidadDeLados);
    this.marcoPuerta.setPosition((x0 + xn) / 2, (y0 + yn) / 2, ALTO_MARCO / 2);
    this.marcoPuerta.addChild(EJES_DE_COORDENADAS)
    this.muralla.addChild(this.marcoPuerta);

    this.addChild(this.muralla)
  }
}

class TorreCastillo extends Objeto3D {
  constructor(alturaDeLosPisos, cantidadDePisos) {
    super();

    if (alturaDeLosPisos !== TorreCastillo.alturaDeLosPisos || cantidadDePisos !== TorreCastillo.cantidadDePisos) {
      TorreCastillo.alturaDeLosPisos = alturaDeLosPisos;
      TorreCastillo.cantidadDePisos = cantidadDePisos;

      const alturaInferior = ((TorreCastillo.cantidadDePisos - 1) + TorreCastillo.EXCEDENTE_PORCENTUAL_RESPECTO_ALTURA_PISO_PARA_ALTURA_INFERIOR) * TorreCastillo.alturaDeLosPisos 
      const alturaSuperior = TorreCastillo.alturaDeLosPisos * 0.8
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

  MIN_MURALLAS = 4;
  MAX_MURALLAS = 8;

  MIN_ALTURA_MURALLA = 4;
  MAX_ALTURA_MURALLA = 8;

  constructor(
    pisos = Castillo.CANTIDAD_DE_PISOS_DEFAULT, 
    largo = Piso.LARGO_DEFAULT, 
    ancho = Piso.ANCHO_DEFAULT, 
    cantidadDeLadosDeLaMuralla = Muralla.CANTIDAD_DE_LADOS_DEFAULT,
    alturaMuralla = Muralla.ALTURA_DEFAULT
  ) {
    super();
    this._init(pisos, largo, ancho, cantidadDeLadosDeLaMuralla, alturaMuralla)
  }

  _init(pisos, largo, ancho, cantidadDeLadosDeLaMuralla, alturaMuralla) {
    // Primero eliminamos las instancias viejas si las hay
    this.children.forEach(child => {
      child.destroy();
      this.removeChild(child);
    });
    this.children = []

    this.cantidadDePisos = pisos;
    this.pisos = [];
    this.largo = largo;
    this.ancho = ancho;
    this.cantidadDeLadosDeLaMuralla = cantidadDeLadosDeLaMuralla;
    this.alturaMuralla = alturaMuralla;

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

    // Muralla
    const radioMuralla = Math.sqrt(Math.pow(this.ancho, 2) + Math.pow(this.largo, 2));
    const muralla = new Muralla(
      radioMuralla * Muralla.FACTOR_EXCEDENTE,
      cantidadDeLadosDeLaMuralla,
      this.alturaMuralla
    );

    this.setRotation(0, Math.PI / 2, 0)

    this.addChild(muralla);
  }

  variarPisos = (val) => {
    let cantidadDePisosNueva = val || this.cantidadDePisos + 1;
    if (cantidadDePisosNueva > this.MAX_CANTIDAD_PISOS) {
      cantidadDePisosNueva = this.MIN_CANTIDAD_PISOS;
    }

    this._init(cantidadDePisosNueva, this.largo, this.ancho, this.cantidadDeLadosDeLaMuralla, this.alturaMuralla)
  }

  variarLargo = (val) => {
    let nuevoLargo = val || this.largo + 1;
    if (nuevoLargo > this.MAX_LARGO) {
      nuevoLargo = this.MIN_LARGO;
    }

    this._init(this.cantidadDePisos, nuevoLargo, this.ancho, this.cantidadDeLadosDeLaMuralla, this.alturaMuralla)
  }

  variarAncho = (val) => {
    let nuevoAncho = val || this.ancho + 1;
    if (nuevoAncho > this.MAX_ANCHO) {
      nuevoAncho = this.MIN_ANCHO;
    }

    this._init(this.cantidadDePisos, this.largo, nuevoAncho, this.cantidadDeLadosDeLaMuralla, this.alturaMuralla);
  }

  variarLadosDeMuralla = (val) => {
    let nuevasMurallas = val || this.cantidadDeLadosDeLaMuralla + 1;
    if (nuevasMurallas > this.MAX_MURALLAS) {
      nuevasMurallas = this.MIN_MURALLAS;
    }

    this._init(this.cantidadDePisos, this.largo, this.ancho, nuevasMurallas, this.alturaMuralla);
  }

  variarAlturaDeMuralla = (val) => {
    let nuevaAltura = val || this.alturaMuralla + 1;
    if (nuevaAltura > this.MAX_ALTURA_MURALLA) {
      nuevaAltura = this.MIN_ALTURA_MURALLA;
    }

    this._init(this.cantidadDePisos, this.largo, this.ancho, this.cantidadDeLadosDeLaMuralla, nuevaAltura);
  }
}

Castillo.CANTIDAD_DE_PISOS_DEFAULT = 3;

Muralla.CANTIDAD_DE_LADOS_DEFAULT = 8;
Muralla.FACTOR_EXCEDENTE = 1.10;
Muralla.ALTURA_DEFAULT = 7;
Muralla.ANCHO = 4;

TorreMuralla.ALTURA_EXCEDENTE_PORCENTUAL = 0.30;
TorreMuralla.RADIO = 4;
TorreMuralla.ANCHO_TOROIDE = 0.2 * TorreMuralla.RADIO;
TorreMuralla.ALTO_TOROIDE = TorreMuralla.ANCHO_TOROIDE * 1.7;

Piso.LARGO_DEFAULT = 10;
Piso.ANCHO_DEFAULT = 20;
Piso.ALTURA = 3;

TechoCastillo.ALTURA = Piso.ALTURA * 1.4;
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