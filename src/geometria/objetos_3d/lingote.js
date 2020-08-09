import Objeto3D from '../objeto_3d.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';
import Trapecio from '../superficie_barrido/poligonos/trapecio.js';

// Crea un Lingote (que no es mas que un trapecio 3D),
// ubicando su centro en el centro de masa del mismo
class Lingote extends Objeto3D {
  constructor(anchoInferior, anchoSuperior, altura, largo, material = DEFAULT_MATERIAL, repeticionesEnU = 1, repeticionesEnV = 1) {
    super();

    this.objeto = new Objeto3D({
      geometry: new SuperficieBarrido(new Trapecio(anchoInferior, anchoSuperior, altura, repeticionesEnU), new Recta(largo, repeticionesEnV), true),
      material: material,
      glContext: gl
    });

    this.objeto.setPosition(-largo / 2, 0, 0);

    this.addChild(this.objeto);
  }
}

export default Lingote;