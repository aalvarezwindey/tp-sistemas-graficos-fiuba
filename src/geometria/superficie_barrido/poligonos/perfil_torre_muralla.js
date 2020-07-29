import Poligono, { Vertice } from "../poligono.js";
import BSplineCuadratica from "../../curvas/bspline/bspline_cuadratica.js";


class PerfilTorreMuralla extends Poligono {
  constructor(r = 7, h = 17.5) {
    super();
    
    const v0 = [r - 1, - (10/35) * h, 0];
    const v1 = [r + 1, + (10/35) * h, 0];
    const v2 = [r - 3, + (30/35) * h, 0];
    const v3 = [r + 3, + (40/35) * h, 0];
    const x0 = new Vertice();
    x0.posicion = [0, h, 0];
    x0.normal = [0, 1, 0];
    x0.tangente = [1, 0, 0];
    x0.binormal = [0, 0, 1];

    const puntosDeControl = [v0, v1, v2, v3];

    const curva = new BSplineCuadratica({ puntosDeControl });
    curva.vertices.forEach(v => {
      // Rotamos la tangente 90 grados para obtener la normal
      vec3.rotateZ(v.normal, v.tangente, [0, 0, 0], -Math.PI / 2);
    })

    // Vertice de fin de curva
    const x1 = curva.vertices[curva.vertices.length - 1].clone();
    x1.normal = [0, 1, 0];
    x1.tangente = [1, 0, 0];

    this.vertices.push(...curva.vertices, x1, x0)

    this.centro.posicion = [r / 2, h / 4, 0];
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