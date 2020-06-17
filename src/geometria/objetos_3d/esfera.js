import Objeto3D from '../objeto_3d.js';
import Circulo from '../superficie_barrido/poligonos/circulo.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';
import Sphere from '../superficies_parametricas/superficies/sphere.js';

// Crea un esfera de un radio determinado,
// ubicando su centro en el centro de masa del mismo
class Esfera extends Objeto3D {
  constructor(radio, material = DEFAULT_MATERIAL) {
    super();

    this.objeto = new Objeto3D({
      geometry: new Sphere(radio),
      material: material,
      glContext: gl
    });

    this.addChild(this.objeto);
  }
}

export default Esfera;