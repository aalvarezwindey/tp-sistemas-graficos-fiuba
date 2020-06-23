import Poligono, { Vertice } from "../poligono.js";
import BSplineCuadratica from "../../curvas/bspline/bspline_cuadratica.js";


class PerfilMuralla extends Poligono {
  constructor() {
    super();

    /*  

              * v3
              *
              *w1 w2
              * /\
              *|  |_____
              |w0  w3   x0
              | 
              | 
             /
       v1* _/ * v2
          /
         /
         |
         |
         | (0, 0)
         *
         *
         * 
         * 
         * 
         * 
        v0

        v0 = (0, -alturaCurva1 / 2)
        v1 = (0, alturaCurva1 / 2)
        v2 = (anchoCurva1, alturaCurva1 / 2)
        v3 = (anchoCurva1, alturaCurva1 * 1.5)

        w0 = (anchoCurva1, alturaCurva1)
        w1 = (anchoCurva1, alturaCurva1 + alturaCurva2);
        w2 = (anchoCurva1 + anchoCurva2, alturaCurva1 + alturaCurva2)
        w3 = (anchoCurva1 + anchoCurva2, alturaCurva1)

        x0 = (anchoCurva1 + anchoCurva2 + anchoCanaleta / 2, alturaCurva1)

        // Si queremos mover el (0, 0) debajo de x0 le sumamos?restamos? a todos los vertices
        // un valor de anchoCurva1 + anchoCurva2 + anchoCanaleta/2 y de ahi espejamos los vertices y obtenemos la otra mitad
    */

    const SCALE_FACTOR = 0.5;

    const alturaCurva1 = 8 * SCALE_FACTOR;
    const alturaCurva2 = 0.5 * SCALE_FACTOR;
    const anchoCurva1 = 1 * SCALE_FACTOR;
    const anchoCurva2 = 0.5 * SCALE_FACTOR;
    const anchoCanaleta = 2 * SCALE_FACTOR;

    const offset = - (anchoCurva1 + anchoCurva2 + anchoCanaleta / 2);



    const v0 = [offset + 0, -alturaCurva1 / 2, 0];
    const v1 = [offset + 0, alturaCurva1 / 2, 0];
    const v2 = [offset + anchoCurva1, alturaCurva1 / 2, 0];
    const v3 = [offset + anchoCurva1, alturaCurva1 * 1.5, 0];

    const w0 = [offset + anchoCurva1, alturaCurva1, 0];
    const w1 = [offset + anchoCurva1, alturaCurva1 + alturaCurva2, 0];
    const w2 = [offset + anchoCurva1 + anchoCurva2, alturaCurva1 + alturaCurva2, 0];
    const w3 = [offset + anchoCurva1 + anchoCurva2, alturaCurva1, 0];

    const x0 = new Vertice();
    x0.posicion = [offset + anchoCurva1 + anchoCurva2 + anchoCanaleta / 2, alturaCurva1, 0];
    x0.normal = [0, 1, 0];
    x0.tangente = [1, 0, 0];
    x0.binormal = [0,0,1]

    const curvaBspline1 = new BSplineCuadratica(
      { puntosDeControl: [v0, v1, v2, v3] },
      20,
    );

    const curvaBspline2 = new BSplineCuadratica(
      { puntosDeControl: [w0, w0, w1, w2, w3, w3] },
      20
    );

    this.vertices.push(...curvaBspline1.vertices, ...curvaBspline2.vertices, x0);

    // Espejamos los vertices para crear la otra mitad del perfil
    const tamanioOriginal = this.vertices.length;
    for (let i = tamanioOriginal - 1 ; i >= 0 ; i--) {
      const verticeEspejado = this.vertices[i].clone();
      verticeEspejado.posicion[0] = - verticeEspejado.posicion[0];

      this.vertices.push(verticeEspejado);
    }

    this.centro.posicion = [anchoCurva1, alturaCurva1 / 2, 0];
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

export default PerfilMuralla;