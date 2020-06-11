import Objeto3D from '../../geometria/objeto_3d.js'
import Recta from '../../geometria/superficie_barrido/recorridos_parametricos/recta.js';
import DefaultMaterial from '../../material/types/default_material.js';
import SuperficieBarrido from '../../geometria/superficie_barrido/superficie_barrido.js';
import Circulo from '../../geometria/superficie_barrido/poligonos/circulo.js';

const ANCHO_RUEDA = 0.2;
const DIAMETRO_RUEDA = 1

class Rueda extends Objeto3D {
  constructor() {
    super({
      geometry: new SuperficieBarrido(new Circulo(DIAMETRO_RUEDA), new Recta(ANCHO_RUEDA)),
      material: new DefaultMaterial(shadersManager),
      glContext: gl
    });
  }
}

class Catapulta extends Objeto3D {
  constructor() {
    super();

    const rueda1 = new Rueda();
    const rueda2 = new Rueda();
    const rueda3 = new Rueda();
    const rueda4 = new Rueda();

    rueda1.setPosition(-7, 0, -3);
    rueda1.setRotation(0, Math.PI / 2, 0);

    rueda2.setPosition(7, 0, -3);
    rueda2.setRotation(0, Math.PI / 2, 0);

    rueda3.setPosition(7, 0, 3);
    rueda3.setRotation(0, Math.PI / 2, 0);

    rueda4.setPosition(-7, 0, 3);
    rueda4.setRotation(0, Math.PI / 2, 0);

    this.addChild(rueda1);
    this.addChild(rueda2);
    this.addChild(rueda3);
    this.addChild(rueda4);
  }
}

export default Catapulta
