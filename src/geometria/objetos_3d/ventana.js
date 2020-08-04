import Objeto3D from '../objeto_3d.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';
import PerfilVentana from '../superficie_barrido/poligonos/perfil_ventana.js';

class Ventana extends Objeto3D {
  constructor(base, altura, profundidad, material = MATERIAL_VIDRIO) {
    super();

    const perfil = new PerfilVentana(base, altura);

    this.objeto = new Objeto3D({
      geometry: new SuperficieBarrido(perfil, new Recta(profundidad), true),
      material: material,
      glContext: gl
    });

    this.objeto.setPosition(-profundidad/2, 0, 0);

    this.addChild(this.objeto);
  }
}

export default Ventana;