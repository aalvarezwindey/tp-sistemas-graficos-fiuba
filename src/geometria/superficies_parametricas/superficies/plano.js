import SuperficieParametrica from "../superficie_parametrica.js";

class Plano extends SuperficieParametrica {
  constructor(ancho, largo) {
    super();
    this.ancho = ancho;
    this.largo = largo;
  }

  getPosicion(u, v) {
    var x = (u - 0.5) * this.ancho;
    var z = (v - 0.5) * this.largo;
    return [x, 0, z];
  }

  getNormal(u, v) {
    return [0, 1, 0];
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  };
}

export default Plano;