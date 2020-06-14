import Objeto3D from '../objeto_3d.js';
import Rectangulo from '../superficie_barrido/poligonos/rectangulo.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';

// Crea un Prisma de una altura 'alto y un perfil ractangular de 'lado1'x'lado2',
// ubicando su centro en el centro de masa del mismo
class Prisma extends Objeto3D {
  constructor(lado1, lado2, alto) {
    super();

    this.prisma = new Objeto3D({
      geometry: new SuperficieBarrido(new Rectangulo(lado1, lado2), new Recta(alto), true),
      material: new DefaultMaterial(shadersManager),
      glContext: gl
    });

    this.prisma.setPosition(-alto / 2, 0, 0);

    this.addChild(this.prisma);
  }
}

export default Prisma;