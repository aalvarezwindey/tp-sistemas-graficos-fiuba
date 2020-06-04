import Recorrido from "../recorrido.js";

class Recta extends Recorrido {
  constructor(largo) {
    super();
    this.largo = largo;
  }

  getPosicion(u) {
    return [this.largo * u, 0, 0];
  }

  getTangente(u) {
    return [this.largo * u, 0, 0];
  }

  getNormal(u) {
    return [0, 1, 0];
  }

  getBinormal(u) {
    return [0, 0, 1];
  }
}

export default Recta;