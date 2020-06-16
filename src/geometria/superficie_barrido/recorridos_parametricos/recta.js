import RecorridoParametrico from "../recorrido_parametrico.js";

class Recta extends RecorridoParametrico {
  constructor(largo) {
    super();
    this.largo = largo;

    this.sentido = null;
  }

  getPosicion(u) {
    if (!this.sentido) return [this.largo * u, 0, 0];
    switch(this.sentido) {
      case 'x': return [this.largo * u, 0, 0];
      case 'y': return [0, this.largo * u, 0];
      case 'z': return [0, 0, this.largo * u];
      default: return [this.largo * u, 0, 0];
    }
  }

  getTangente(u) {
    return [1, 0, 0];
  }

  getNormal(u) {
    return [0, 1, 0];
  }

  getBinormal(u) {
    return [0, 0, 1];
  }
}

export default Recta;