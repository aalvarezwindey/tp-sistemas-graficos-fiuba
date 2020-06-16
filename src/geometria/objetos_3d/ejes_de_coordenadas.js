import Objeto3D from '../objeto_3d.js';
import SuperficieBarrido from '../superficie_barrido/superficie_barrido.js';
import Recta from '../superficie_barrido/recorridos_parametricos/recta.js';
import Circulo from '../superficie_barrido/poligonos/circulo.js';

class EjesDeCoordenadas extends Objeto3D {
  MAX_SCALE = 10;
  MIN_SCALE = 1;
  OFFSET_SCALE = 1;
  constructor() {
    super();

    if (!EjesDeCoordenadas.x) {
      this._init();
    }

    this.x = EjesDeCoordenadas.x;
    this.y = EjesDeCoordenadas.y;
    this.z = EjesDeCoordenadas.z;

    this.addChild(this.x);
    this.addChild(this.y);
    this.addChild(this.z);
  }

  _init() {
    const rectaX = new Recta(EjesDeCoordenadas.LARGO);
    rectaX.sentido = 'x'

    const rectaY = new Recta(EjesDeCoordenadas.LARGO);
    rectaY.sentido = 'y'

    const rectaZ = new Recta(EjesDeCoordenadas.LARGO);
    rectaZ.sentido = 'z'

    const geometriaX = new SuperficieBarrido(new Circulo(EjesDeCoordenadas.RADIO_EJE, 10), rectaX, true, 10);
    const geometriaY = new SuperficieBarrido(new Circulo(EjesDeCoordenadas.RADIO_EJE, 10), rectaY, true, 10);
    const geometriaZ = new SuperficieBarrido(new Circulo(EjesDeCoordenadas.RADIO_EJE, 10), rectaZ, true, 10);

    EjesDeCoordenadas.x = new Objeto3D({ geometry: geometriaX, material: MATERIAL_ROJO, glContext: gl });
    EjesDeCoordenadas.y = new Objeto3D({ geometry: geometriaY, material: MATERIAL_VERDE, glContext: gl });
    EjesDeCoordenadas.z = new Objeto3D({ geometry: geometriaZ, material: MATERIAL_AZUL, glContext: gl });

    document.addEventListener('keydown', event => {
      switch(event.key) {
        case '+': {
          EjesDeCoordenadas.SCALE = Math.min(this.MAX_SCALE, EjesDeCoordenadas.SCALE + this.OFFSET_SCALE);
          EjesDeCoordenadas.x.setScale(EjesDeCoordenadas.SCALE, 1, 1)
          EjesDeCoordenadas.y.setScale(1, EjesDeCoordenadas.SCALE, 1)
          EjesDeCoordenadas.z.setScale(1, 1, EjesDeCoordenadas.SCALE)
          break;
        }

        case '-': {
          EjesDeCoordenadas.SCALE = Math.max(this.MIN_SCALE, EjesDeCoordenadas.SCALE - this.OFFSET_SCALE);
          EjesDeCoordenadas.x.setScale(EjesDeCoordenadas.SCALE, 1, 1)
          EjesDeCoordenadas.y.setScale(1, EjesDeCoordenadas.SCALE, 1)
          EjesDeCoordenadas.z.setScale(1, 1, EjesDeCoordenadas.SCALE)
          break;
        }

        default: {
          break;
        }
      }
    });
  }
}
EjesDeCoordenadas.SCALE = 1;
EjesDeCoordenadas.RADIO_EJE = 0.1;
EjesDeCoordenadas.LARGO = 1;

export default EjesDeCoordenadas;
