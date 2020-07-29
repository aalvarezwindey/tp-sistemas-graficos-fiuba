import Poligono, { Vertice } from "../poligono.js";
import BezierCuadratica from "../../curvas/bezier/bezier_cuadratica.js";

class PerfilVentana extends Poligono {
  constructor(base, altura) {
    super();

    const alturaPuntoDeControlIntermedio = 1.5 * altura;

    /*           p1 
    
    
        v4 = p0          v1 = p2
        *-----------------*
        |                 | A
        |                 | l
        |                 | t
        |                 | u
        |                 | r
        |                 | a
        *-----------------*
      v3                   v2 
        Base
    */

    const v1 = new Vertice();
    const v2 = new Vertice();
    v1.posicion = [base / 2, altura / 2, 0];
    v1.normal = [1, 0, 0];
    v1.binormal = [0, 0, 1];
    v2.posicion = [base / 2, -altura / 2, 0];
    v2.normal = [1, 0, 0];
    v2.binormal = [0, 0, 1];

    const v3 = new Vertice();
    const v4 = new Vertice();
    v3.posicion = [base / 2, -altura / 2, 0];
    v3.normal = [0, -1, 0];
    v3.binormal = [0, 0, 1];
    v4.posicion = [-base / 2, -altura / 2, 0];
    v4.normal = [0, -1, 0];
    v4.binormal = [0, 0, 1];

    const v5 = new Vertice();
    const v6 = new Vertice();
    v5.posicion = [-base / 2, -altura / 2, 0];
    v5.normal = [-1, 0, 0];
    v5.binormal = [0, 0, 1];
    v6.posicion = [-base / 2, altura / 2, 0];
    v6.normal = [-1, 0, 0];
    v6.binormal = [0, 0, 1];

    const curvaBezier = new BezierCuadratica(
      v1.posicion,
      [0, alturaPuntoDeControlIntermedio, 0],
      v6.posicion
    );

    curvaBezier.vertices.forEach(v => {
      // Rotamos la tangente 90 grados para obtener la normal
      vec3.rotateZ(v.normal, v.tangente, [0, 0, 0], -Math.PI / 2);
      v.binormal = [0, 0, 1];
    })

    this.vertices.push(...curvaBezier.vertices);
    [v1, v2, v3, v4, v5, v6].forEach(v => this.vertices.push(v));

    this.centro.posicion = vec3.fromValues(base / 2, altura/ 2, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);
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

export default PerfilVentana;