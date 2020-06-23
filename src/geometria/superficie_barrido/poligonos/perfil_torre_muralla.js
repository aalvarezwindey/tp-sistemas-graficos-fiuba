import Poligono, { Vertice } from "../poligono.js";
import BSplineCuadratica from "../../curvas/bspline/bspline_cuadratica.js";


class PerfilTorreMuralla extends Poligono {
  constructor() {
    super();

    /*  

    */

    const SCALE_FACTOR = 0.5;

    const radio = 8 * SCALE_FACTOR;
    const alturaCurva1 = 3 * SCALE_FACTOR;
    const alturaCurva2 = 3 * SCALE_FACTOR;
    const anchoCurva = 1;

    const offset = - (radio);



    const v0 = [offset + 0, -alturaCurva1, 0];
    const v1 = [offset + 0, alturaCurva1, 0];
    const v2 = [offset + anchoCurva * 2, alturaCurva1, 0];
    const v3 = [offset + anchoCurva * 2, alturaCurva1 + alturaCurva2, 0];
    const v4 = [offset + 0, alturaCurva1 + alturaCurva2, 0];

    const x0 = new Vertice();
    x0.posicion = [offset + radio, alturaCurva1 + alturaCurva2, 0];
    const x1 = new Vertice();
    x1.posicion = [offset + radio, 0, 0];
    const x2 = new Vertice();
    x2.posicion = [offset, 0, 0];

    [x0, x1, x2].forEach(x => {
      x.normal = [0, 1, 0];
      x.tangente = [1, 0, 0];
      x.binormal = [0,0,1];
    });

    const curvaBspline1 = new BSplineCuadratica(
      { puntosDeControl: [v0, v1, v2, v3, v4] },
      20,
    );


    this.vertices.push(...curvaBspline1.vertices, x0, x1, x2);

    this.centro.posicion = [radio / 2, alturaCurva1 / 2, 0];
  }

  getVertice(vertice, nivel) {
    if (!this.transformacion) return vertice;

    return this.transformacion(vertice, nivel);
  }

  // TODO: Quizas el centro nunca deberia transformarse entonces esta func no tiene sentido
  getCentro(nivel) {
    if (!this.transformacion) return this.centro;

    return this.centro;
  }
}

export default PerfilTorreMuralla;