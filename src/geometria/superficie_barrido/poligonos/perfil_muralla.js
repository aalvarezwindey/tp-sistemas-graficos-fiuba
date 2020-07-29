import Poligono, { Vertice } from "../poligono.js";
import BSplineCuadratica from "../../curvas/bspline/bspline_cuadratica.js";

// El parametro altura es desde el piso hasta la plataforma
class PerfilMuralla extends Poligono {
  constructor(altura = 9, ancho = 5) {
    super();

    const A = ancho;
    const H = altura;
    const v0 = [-0.5 * A, -H / 3, 0];
    const v1 = [-0.5 * A, +H / 3, 0];
    const v2 = [-0.3 * A, (7/9) * H, 0];
    const v3 = [-0.3 * A, (11/9) * H, 0];


    const ALTURA_EXCEDENTE_MURALLA = 0.1 * H;
    const w0 = [-0.3 * A, H, 0]
    const w1 = [-0.3 * A, H + ALTURA_EXCEDENTE_MURALLA, 0]
    const w2 = [-0.1 * A, H + ALTURA_EXCEDENTE_MURALLA, 0]
    const w3 = [-0.1 * A, H, 0]

    const x0 = new Vertice();
    x0.posicion = [0, H, 0];
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

    [...curvaBspline1.vertices, ...curvaBspline2.vertices].forEach(v => {
      // Rotamos la tangente 90 grados para obtener la normal
      vec3.rotateZ(v.normal, v.tangente, [0, 0, 0], -Math.PI / 2);
    })

    
    this.vertices.push(...curvaBspline1.vertices, ...curvaBspline2.vertices, x0);

    // Espejamos los vertices para crear la otra mitad del perfil
    const tamanioOriginal = this.vertices.length;
    for (let i = tamanioOriginal - 1 ; i >= 0 ; i--) {
      const verticeEspejado = this.vertices[i].clone();
      verticeEspejado.posicion[0] = - verticeEspejado.posicion[0];

      this.vertices.push(verticeEspejado);
    }

    this.centro.posicion = [0, H/2, 0];
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