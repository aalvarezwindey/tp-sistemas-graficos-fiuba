import Poligono, { Vertice } from "../poligono.js";

class Trapecio extends Poligono {
  /* 
    v2 v3     v4 v5
        *----* 
       /      \
      /        \
     /          \
    /            \
   *--------------*
  v1 v8             v6 v7
  
  */
  constructor(anchoInferior, anchoSuperior, altura, cantRepeticionesTextura = 1) {
    super();
    this.cantRepeticionesTextura = cantRepeticionesTextura;
    this.anguloTrapecio = Math.atan(2 * altura / (anchoInferior - anchoSuperior));

    const v1 = new Vertice();
    v1.posicion = [-anchoInferior / 2, -altura / 2, 0];
    const v2 = new Vertice();
    v2.posicion = [-anchoSuperior / 2, altura / 2, 0];

    const v3 = new Vertice();
    v3.posicion = [-anchoSuperior / 2, altura / 2, 0];
    const v4 = new Vertice();
    v4.posicion = [anchoSuperior / 2, altura / 2, 0];

    const v5 = new Vertice();
    v5.posicion = [anchoSuperior / 2, altura / 2, 0];
    const v6 = new Vertice();
    v6.posicion = [anchoInferior / 2, -altura / 2, 0];

    const v7 = new Vertice();
    v7.posicion = [anchoInferior / 2, -altura / 2, 0];
    const v8 = new Vertice();
    v8.posicion = [-anchoInferior / 2, -altura / 2, 0];

    const anguloNormalDerechaYEjeX = Math.PI - (Math.PI / 2) - this.anguloTrapecio;
    const normalLadoDerecho = [Math.cos(anguloNormalDerechaYEjeX), Math.sin(anguloNormalDerechaYEjeX), 0];
    const normalLadoIzquierdo = [-normalLadoDerecho[0], normalLadoDerecho[1], 0];

    const tangenteLadoDerecho = vec3.create();
    vec3.subtract(tangenteLadoDerecho, v6.posicion, v5.posicion);
    vec3.normalize(tangenteLadoDerecho, tangenteLadoDerecho);

    const tangenteLadoIzquierdo = vec3.create();
    vec3.subtract(tangenteLadoIzquierdo, v2.posicion, v1.posicion);
    vec3.normalize(tangenteLadoIzquierdo, tangenteLadoIzquierdo);

    [v1, v2, v3, v4, v5, v6, v7, v8].forEach(v => v.binormal = [0, 0, 1]);

    v1.tangente = vec3.clone(tangenteLadoIzquierdo);
    v1.normal = vec3.clone(normalLadoIzquierdo);
    v2.tangente = vec3.clone(tangenteLadoIzquierdo);
    v2.normal = vec3.clone(normalLadoIzquierdo);

    v3.tangente = [1, 0, 0];
    v3.normal = [0, 1, 0];
    v4.tangente = [1, 0, 0];
    v4.normal = [0, 1, 0];

    v5.tangente = vec3.clone(tangenteLadoDerecho);
    v5.normal = vec3.clone(normalLadoDerecho);
    v6.tangente = vec3.clone(tangenteLadoDerecho);
    v6.normal = vec3.clone(normalLadoDerecho);

    v7.tangente = [-1, 0, 0];
    v7.normal = [0, -1, 0];
    v8.tangente = [-1, 0, 0];
    v8.normal = [0, -1, 0];

    this.centro.posicion = vec3.fromValues(0, 0, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);

    [v1, v2, v3, v4, v5, v6, v7, v8].forEach(v => {
      v.coordenadaTextura = ((v[1] + (altura / 2)) / altura) * this.cantRepeticionesTextura;
      this.vertices.push(v)
    });
  }

  getVertice(vertice, nivel) {
    if (!this.transformacion) return vertice;
  }

  getCentro(nivel) {
    if (!this.transformacion) return this.centro;
  }
}

export default Trapecio;