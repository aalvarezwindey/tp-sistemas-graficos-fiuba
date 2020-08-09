import RecorridoParametrico from "../recorrido_parametrico.js";

class Recta extends RecorridoParametrico {
  constructor(largo, cantRepeticionesTextura = 1) {
    super();
    this.largo = largo;

    this.sentido = 'x';

    this.cantRepeticionesTextura = cantRepeticionesTextura;
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
    switch(this.sentido) {
      case 'x': return [1, 0, 0];
      case 'y': return [0, 1, 0];
      case 'z': return [0, 0, 1];
      default: return [1, 0, 0];
    }
  }

  getNormal(u) {
    switch(this.sentido) {
      case 'x': return [0, 1, 0];
      case 'y': return [0, 0, 1];
      case 'z': return [1, 0, 0];
      default: return [0, 1, 0];
    }
  }

  getBinormal(u) {
    switch(this.sentido) {
      case 'x': return [0, 0, 1];
      case 'y': return [1, 0, 0];
      case 'z': return [0, 1, 0];
      default: return [0, 0, 1];
    }
  }

  getLongitudRecorrido() {
    return this.largo;
  }

  getCoordenadaTextura(u) {
    return u * this.cantRepeticionesTextura;
  }
}

export default Recta;