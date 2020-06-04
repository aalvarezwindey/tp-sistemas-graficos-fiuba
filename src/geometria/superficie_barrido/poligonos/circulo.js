import Poligono, { Vertice } from "../poligono.js";

class Circulo extends Poligono {
  constructor(radio, definicion = 100) {
    super();

    for (let i = 0; i < definicion; i++) {
      const vertice = new Vertice();
      vertice.posicion = [
        radio * Math.cos(2 * Math.PI * i),
        radio * Math.sin(2 * Math.PI * i),
        0
      ];

      vertice.normal = [
        0,
        0,
        1
      ];
      this.vertices.push(vertice);
    }
  }
}

export default Circulo