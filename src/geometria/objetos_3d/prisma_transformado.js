import Objeto3D from '../objeto_3d.js';
import Rectangulo from '../superficie_barrido/poligonos/rectangulo.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';

// Crea un Prisma de una altura 'alto y un perfil ractangular de 'lado1'x'lado2',
// ubicando su centro en el centro de masa del mismo
class PrismaTransformado extends Objeto3D {
  constructor(lado1, lado2, alto, material = DEFAULT_MATERIAL, transformacion) {
    super();

    const rectangulo = new Rectangulo(lado1, lado2);
    rectangulo.setTransformacion(transformacion);

    this.objeto = new Objeto3D({
      geometry: new SuperficieBarrido(rectangulo, new Recta(alto), true),
      material: material,
      glContext: gl
    });

    this.objeto.setPosition(-alto / 2, 0, 0);

    this.addChild(this.objeto);
  }
}

export default PrismaTransformado;