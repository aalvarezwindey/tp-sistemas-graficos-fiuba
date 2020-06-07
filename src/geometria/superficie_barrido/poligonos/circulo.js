import Poligono, { Vertice } from "../poligono.js";

class Circulo extends Poligono {
  constructor(radio, definicion = 100) {
    super();

    this.radio = radio;

    const _2pi = Math.PI * 2;

    for (let i = 0; i <= definicion; i++) {
      const u = i / definicion;
      const vertice = new Vertice();
      vertice.posicion = vec3.fromValues(
        radio * Math.cos(_2pi * u),
        radio * Math.sin(_2pi * u),
        0
      )


      vertice.normal = vec3.fromValues(...vertice.posicion);
      vec3.normalize(vertice.normal, vertice.normal);

      vertice.tangente = vec3.fromValues(
        -1 * radio * _2pi * Math.sin(_2pi * u),
        radio * _2pi * Math.cos(_2pi * u),
        0
      );

      const tangenteX = -1 * _2pi * radio * radio * Math.sin(_2pi * u) * Math.cos(_2pi * u);
      vertice.binormal = vec3.fromValues(
        tangenteX,
        -tangenteX,
        0
      );

      this.vertices.push(vertice);
    }
  }
}

export default Circulo