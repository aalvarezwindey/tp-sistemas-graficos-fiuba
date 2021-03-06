import Poligono, { Vertice } from "../poligono.js";
import BezierCubica from "../../curvas/bezier/bezier_cubica.js";

class PerfilTorre extends Poligono {
  constructor({ alturaInferior, radioInferior, alturaSuperior, radioSuperior, alturaCurva, cantRepeticionesTextura }) {
    super();
    this.cantRepeticionesTextura = cantRepeticionesTextura || 1;

    /*  

        v4         v5
        *----------*
        |          | A
        |          | l
        |          | t
        |          | u
        |          | r
        |          | a
  p3=v3 *          *
        \          |
      p2 \ p1      |
          \        |
    p0=v2  *   C   *
           |       |
           |       |
           |       |
           |       |
           |       |
           |       |
           *-------*
          v1       v0 = (0, 0)

          C = Centro
          CTE = 1

          v0 = (0, 0)
          v1 = v0 + (-radioInferior, 0)
          v2 = v1 + (0, alturaInferior) = p0
          p1 = p0 + (0, CTE)
          p2 = p1 + (- (radioSuperior - radioInferior), 0)
          v3 = p2 + (0, CTE) = p3
          v4 = v3 + (0, alturaSuperior)
          v5 = v4 + (0, -radioSuperior)
    */

    const CTE = alturaCurva / 2;

    const v0 = new Vertice()
    v0.posicion = vec3.fromValues(0, 0, 0);
    v0.normal = [0, -1, 0];

    const v1 = new Vertice();
    const v1_bis = new Vertice();
    v1.posicion = vec3.fromValues(v0.posicion[0] - radioInferior, v0.posicion[1], v0.posicion[2]);
    v1.normal = [0, -1, 0];
    v1_bis.posicion = vec3.fromValues(v0.posicion[0] - radioInferior, v0.posicion[1], v0.posicion[2]);
    v1_bis.normal = [-1, 0, 0];

    const v2 = new Vertice();
    v2.posicion = vec3.fromValues(v1.posicion[0], v1.posicion[1] + alturaInferior, v1.posicion[2]);
    v2.normal = [-1, 0, 0];
    const p0 = v2.clone();

    const p1 = new Vertice();
    p1.posicion = vec3.fromValues(p0.posicion[0], p0.posicion[1] + CTE, p0.posicion[2]);

    const p2 = new Vertice();
    p2.posicion = vec3.fromValues(p1.posicion[0] - (radioSuperior - radioInferior), p1.posicion[1], p1.posicion[2]);

    const v3 = new Vertice();
    v3.posicion = vec3.fromValues(p2.posicion[0], p2.posicion[1] + CTE, p2.posicion[2]);
    v3.normal = [-1, 0, 0];
    const p3 = v3;

    const v4 = new Vertice();
    v4.posicion = vec3.fromValues(v3.posicion[0], v3.posicion[1] + alturaSuperior, v3.posicion[2]);
    v4.normal = [-1, 0, 0];
    const v4_bis = v4.clone();
    v4_bis.normal = [0, 1, 0];

    const v5 = new Vertice();
    v5.posicion = vec3.fromValues(v4.posicion[0] + radioSuperior, v4.posicion[1], v4.posicion[2]);
    v5.normal = [0, 1, 0];

    const curvaBezierCubica = new BezierCubica(p0.posicion, p1.posicion, p2.posicion, p3.posicion, 20);

    curvaBezierCubica.vertices.forEach(v => {
      // Rotamos la tangente 90 grados para obtener la normal
      vec3.rotateZ(v.normal, v.tangente, [0, 0, 0], Math.PI / 2);
      v.binormal = [0, 0, 1];
    })

    this.vertices.push(v0);
    this.vertices.push(v1, v1_bis);
    this.vertices.push(v2);
    this.vertices.push(...curvaBezierCubica.vertices);
    this.vertices.push(v3);
    this.vertices.push(v4, v4_bis);
    this.vertices.push(v5);
    // Repetimos el primer vértice para cerrar bien el polígono
    this.vertices.push(v0);

    this.vertices.forEach(v => {
      // coordenada Y del vertice
      // v4.posicion[1] altura total de la torre
      v.coordenadaTextura = v.posicion[1] * this.cantRepeticionesTextura / v4.posicion[1]
    })

    this.centro.posicion = vec3.fromValues(-radioInferior / 2, alturaInferior, 0);
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

export default PerfilTorre;