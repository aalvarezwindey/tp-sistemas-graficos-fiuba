import Objeto3D from '../objeto_3d.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';
import Trapecio from '../superficie_barrido/poligonos/trapecio.js';

// Crea un Lingote (que no es mas que un trapecio 3D),
// ubicando su centro en el centro de masa del mismo
class Lingote extends Objeto3D {
  constructor(anchoInferior, anchoSuperior, altura, largo) {
    super();

    this.lingote = new Objeto3D({
      geometry: new SuperficieBarrido(new Trapecio(anchoInferior, anchoSuperior, altura), new Recta(largo), true),
      material: DEFAULT_MATERIAL,
      glContext: gl
    });

    this.lingote.setPosition(-largo / 2, 0, 0);

    this.addChild(this.lingote);
  }
}

export default Lingote;