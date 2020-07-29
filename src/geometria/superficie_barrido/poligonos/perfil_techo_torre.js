import Poligono, { Vertice } from "../poligono.js";
import BezierCubica from "../../curvas/bezier/bezier_cubica.js";

class PerfilTechoTorre extends Poligono {
  constructor(radio, altura) {
    super();

    /*  
                           * v2 = p3     _
                          /|              |
                         / |              | altura - (altura * CTE_PORCENTUAL_ALTURA)
                        /  |              |
                       /   * p2          _|
                      /    |
                     /     |
                    /      |
                   /       |
                  /        |
                 /         |
                /          |
               /           |
              /            |
             /             |
            /              |
           /               |
          *-----*----------*
      v1=p0    p1           v0=(0, 0)

          |_____|
          
          radio - (radio * CTE_PORCENTUAL_RADIO)

          v0 = (0, 0)
          v1 = v0 + (-radio, 0) = p0
          p1 = p0 + (radio - (radio * CTE_PORCENTUAL_RADIO), 0)
          v2 = v0 + (0, altura) = p3
          p2 = p3 + (0, - (altura - (altura * CTE_PORCENTUAL_ALTURA)))          
    */

    const CTE_PORCENTUAL_RADIO = 0.1;
    const CTE_PORCENTUAL_ALTURA = 0.25

    const v0 = new Vertice()
    v0.posicion = vec3.fromValues(0, 0, 0);
    v0.normal = [0, -1, 0];

    const v1 = new Vertice();
    v1.posicion = vec3.fromValues(v0.posicion[0] - radio, v0.posicion[1], v0.posicion[2]);
    v1.normal = [0, -1, 0];
    const p0 = v1;

    const p1 = new Vertice();
    p1.posicion = vec3.fromValues(p0.posicion[0] + (radio * CTE_PORCENTUAL_RADIO), p0.posicion[1], p0.posicion[2]);

    
    const v2 = new Vertice();
    v2.posicion = vec3.fromValues(v0.posicion[0], v0.posicion[1] + altura, v0.posicion[2]);
    v2.normal = [0, 1, 0];
    const p3 = v2;
    
    const p2 = new Vertice();
    p2.posicion = vec3.fromValues(p3.posicion[0], p3.posicion[1] - (altura * CTE_PORCENTUAL_ALTURA), p3.posicion[2]);
  
    const curvaBezierCubica = new BezierCubica(p0.posicion, p1.posicion, p2.posicion, p3.posicion, 20);

    curvaBezierCubica.vertices.forEach(v => {
      // Rotamos la tangente 90 grados para obtener la normal
      vec3.rotateZ(v.normal, v.tangente, [0, 0, 0], Math.PI / 2);
    })

    this.vertices.push(v0);
    this.vertices.push(v1);
    this.vertices.push(...curvaBezierCubica.vertices);
    this.vertices.push(v2);
    // Repetimos el primer vértice para cerrar bien el polígono
    this.vertices.push(v0);

    
    this.centro.posicion = vec3.fromValues(...p2.posicion);
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

export default PerfilTechoTorre;