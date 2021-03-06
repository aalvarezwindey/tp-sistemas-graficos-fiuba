import Objeto3D from '../objeto_3d.js';
import Circulo from '../superficie_barrido/poligonos/circulo.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';

// Crea un cilindro de un largo y radio determinado,
// ubicando su centro en el centro de masa del mismo
class Cilindro extends Objeto3D {
  constructor(radio, alto, material = DEFAULT_MATERIAL, cantRepeticionesEnU = 1, cantRepeticionesEnV = 1) {
    super();

    this.objeto = new Objeto3D({
      geometry: new SuperficieBarrido(new Circulo(radio, 40, cantRepeticionesEnU), new Recta(alto, cantRepeticionesEnV), true),
      material: material,
      glContext: gl
    });

    this.objeto.setPosition(-alto / 2, 0, 0);

    this.addChild(this.objeto);
  }
}

export default Cilindro;