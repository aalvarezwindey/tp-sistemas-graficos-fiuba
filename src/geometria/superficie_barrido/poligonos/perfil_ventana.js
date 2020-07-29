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

    const vertice1 = new Vertice();
    vertice1.posicion = vec3.fromValues(base / 2, altura / 2, 0);
    vertice1.normal = vec3.fromValues(0, 0, 1);
    vertice1.tangente = vec3.fromValues(0, 1, 0);
    vertice1.binormal = vec3.fromValues(1, 0, 0);

    const vertice2 = new Vertice();
    vertice2.posicion = vec3.fromValues(base / 2, -altura / 2, 0);
    vertice2.normal = vec3.fromValues(0, 0, 1);
    vertice2.tangente = vec3.fromValues(0, 1, 0);
    vertice2.binormal = vec3.fromValues(1, 0, 0);

    const vertice3 = new Vertice();
    vertice3.posicion = vec3.fromValues(-base / 2, -altura / 2, 0);
    vertice3.normal = vec3.fromValues(0, 0, 1);
    vertice3.tangente = vec3.fromValues(0, 1, 0);
    vertice3.binormal = vec3.fromValues(1, 0, 0);

    const vertice4 = new Vertice();
    vertice4.posicion = vec3.fromValues(-base / 2, altura / 2, 0);
    vertice4.normal = vec3.fromValues(0, 0, 1);
    vertice4.tangente = vec3.fromValues(0, 1, 0);
    vertice4.binormal = vec3.fromValues(1, 0, 0);

    const curvaBezier = new BezierCuadratica(
      vertice1.posicion,
      [0, alturaPuntoDeControlIntermedio, 0],
      vertice4.posicion
    );

    this.vertices.push(vertice4);

    // Adaptamos la tangente, normal y binormal para que sea acorde a la base de la ventana
    curvaBezier.vertices.forEach(v => {
      v.normal = vec3.fromValues(0, 0, 1);
      v.tangente = vec3.fromValues(0, 1, 0);
      v.binormal = vec3.fromValues(1, 0, 0);
    })


    this.vertices.push(...curvaBezier.vertices);
    this.vertices.push(vertice1);
    this.vertices.push(vertice2);
    this.vertices.push(vertice3);
    // Repetimos el primer vértice para cerrar bien el polígono
    this.vertices.push(vertice4);

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