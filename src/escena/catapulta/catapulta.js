import Objeto3D from '../../geometria/objeto_3d.js'
import Recta from '../../geometria/superficie_barrido/recorridos_parametricos/recta.js';
import DefaultMaterial from '../../material/types/default_material.js';
import SuperficieBarrido from '../../geometria/superficie_barrido/superficie_barrido.js';
import Circulo from '../../geometria/superficie_barrido/poligonos/circulo.js';
import Cilindro from '../../geometria/objetos_3d/cilindro.js';


class Rueda extends Objeto3D {
  ANCHO_RUEDA = 0.2;
  RADIO_RUEDA = 1;

  constructor() {
    super();

    // Creates geometria only the first time
    Rueda.cilindro = Rueda.cilindro || new Cilindro(this.RADIO_RUEDA, this.ANCHO_RUEDA);

    this.addChild(Rueda.cilindro);
  }
}

class EjeDeRuedas extends Objeto3D {
  LARGO_EJE = 8;
  RADIO_EJE = 0.1;

  constructor() {
    super();

    // Creates geometria only the first time
    EjeDeRuedas.cilindro = EjeDeRuedas.cilindro || new Cilindro(this.RADIO_EJE, this.LARGO_EJE);

    this.addChild(EjeDeRuedas.cilindro);
  }
}

class TrenDeRuedas extends Objeto3D {
  ENCASTRE = 0.2;

  constructor() {
    super();
    this.rueda1 = new Rueda();
    this.rueda2 = new Rueda();
    this.eje = new EjeDeRuedas();

    this.eje.addChild(this.rueda1);
    this.eje.addChild(this.rueda2);

    this.rueda1.setPosition(- (this.eje.LARGO_EJE / 2 - this.ENCASTRE), 0, 0);
    this.rueda2.setPosition(+ (this.eje.LARGO_EJE / 2 - this.ENCASTRE), 0, 0);

    this.addChild(this.eje);
  }
}


class Catapulta extends Objeto3D {
  DISTANCIA_ENTRE_TRENES_DE_RUEDAS = 6;

  constructor() {
    super();
    const trenDelantero = new TrenDeRuedas();
    const trenTrasero = new TrenDeRuedas();


    trenDelantero.setPosition(0, 0, - this.DISTANCIA_ENTRE_TRENES_DE_RUEDAS);
    trenTrasero.setPosition(0, 0, + this.DISTANCIA_ENTRE_TRENES_DE_RUEDAS);

    this.addChild(trenDelantero);
    this.addChild(trenTrasero);

  }
}

export default Catapulta
