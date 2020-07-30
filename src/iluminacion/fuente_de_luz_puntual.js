import Objeto3D from "../geometria/objeto_3d.js";
import Esfera from '../geometria/objetos_3d/esfera.js';

class FuenteDeLuzPuntual extends Objeto3D {
  constructor(radio) {
    super()
    this.esfera = new Esfera(radio, MATERIAL_LUZ);

    this.addChild(this.esfera);
  }
}

export default FuenteDeLuzPuntual;