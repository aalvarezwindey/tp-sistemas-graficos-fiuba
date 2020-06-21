import Poligono, { Vertice } from "../poligono.js";

class Trapecio extends Poligono {
  constructor(anchoInferior, anchoSuperior, altura) {
    super();

    this.anchoInferior = anchoInferior;
    this.anchoSuperior = anchoSuperior;
    this.altura = altura;

    const vertice1 = new Vertice();
    vertice1.posicion = vec3.fromValues(-anchoInferior / 2, -altura / 2, 0);
    this.vertices.push(vertice1);

    const vertice2 = new Vertice();
    vertice2.posicion = vec3.fromValues(-anchoSuperior / 2, altura / 2, 0);
    this.vertices.push(vertice2);

    const vertice3 = new Vertice();
    vertice3.posicion = vec3.fromValues(anchoSuperior / 2, altura / 2, 0);
    this.vertices.push(vertice3);

    const vertice4 = new Vertice();
    vertice4.posicion = vec3.fromValues(anchoInferior / 2, -altura / 2, 0);
    this.vertices.push(vertice4);

    // Repetimos el primer vértice para cerrar bien el polígono
    this.vertices.push(vertice1);

    this.vertices.forEach(v => {
      v.normal = vec3.fromValues(0, 0, 1);
      v.tangente = vec3.fromValues(0, 1, 0);
      v.binormal = vec3.fromValues(1, 0, 0);
    });

    this.centro.posicion = vec3.fromValues(0, 0, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);
  }

  getVertice(vertice, nivel) {
    if (!this.transformacion) return vertice;
  }

  getCentro(nivel) {
    if (!this.transformacion) return this.centro;
  }
}

export default Trapecio;