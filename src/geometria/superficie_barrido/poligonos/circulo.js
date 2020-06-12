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

      // calculamos la tangente como la derivada de la posición
      // T = r'(t)
      vertice.tangente = vec3.fromValues(
        -1 * radio * _2pi * Math.sin(_2pi * u),
        radio * _2pi * Math.cos(_2pi * u),
        0
      );
      vec3.normalize(vertice.tangente, vertice.tangente);

      // calculamos la derivada segunda
      const derivadaSegunda = vec3.fromValues(
        -1 * radio * _2pi * _2pi * Math.cos(_2pi * u),
        -1 * radio * _2pi * _2pi * Math.sin(_2pi * u),
        0
      )
      vec3.normalize(derivadaSegunda, derivadaSegunda)

      // calculamos la binormal como B = T x r''(u)
      vec3.cross(vertice.binormal, vertice.tangente, derivadaSegunda);
      vec3.normalize(vertice.binormal, vertice.binormal)

      // calculamos la normal como N = B x T
      vec3.cross(vertice.normal, vertice.binormal, vertice.tangente);
      vec3.normalize(vertice.normal, vertice.normal)

      this.vertices.push(vertice);
    }

    this.centro.posicion = vec3.fromValues(0, 0, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);
  }
}

export default Circulo