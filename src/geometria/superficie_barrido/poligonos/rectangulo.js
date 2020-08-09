import Poligono, { Vertice } from "../poligono.js";

class Rectangulo extends Poligono {
  constructor(base, altura, cantRepeticionesTextura = 1) {
    super();
    /*
      v6 y v7           
      *----------------* v1 y v8
      |                |
      |                |
      |                |
      |                |
      *----------------* v2 y v3
      v4 y v5
    */
    this.base = base;
    this.altura = altura;
    this.perimetro = this.getPerimetro();
    this.cantRepeticionesTextura = cantRepeticionesTextura;

    // Segmento v1 - v2
    const v1 = new Vertice();
    v1.posicion = [base / 2, altura / 2, 0];
    v1.tangente = [0, -1, 0];
    v1.normal = [1, 0, 0];
    v1.binormal = [0, 0, 1];
    v1.coordenadaTextura = 0;

    const v2 = new Vertice();
    v2.posicion = [base / 2, -altura / 2, 0];
    v2.tangente = [0, -1, 0];
    v2.normal = [1, 0, 0];
    v2.binormal = [0, 0, 1];
    v2.coordenadaTextura = (altura / this.perimetro) * this.cantRepeticionesTextura;


    // Segmento v3 - v4
    const v3 = new Vertice();
    v3.posicion = [base / 2, -altura / 2, 0];
    v3.tangente = [-1, 0, 0];
    v3.normal = [0, -1, 0];
    v3.binormal = [0, 0, 1];
    v3.coordenadaTextura = v2.coordenadaTextura;

    const v4 = new Vertice();
    v4.posicion = [-base / 2, -altura / 2, 0];
    v4.tangente = [-1, 0, 0];
    v4.normal = [0, -1, 0];
    v4.binormal = [0, 0, 1];
    v4.coordenadaTextura = (1 / 2) * this.cantRepeticionesTextura;


    // Segmento v5 - v6
    const v5 = new Vertice();
    v5.posicion = [-base / 2, -altura / 2, 0];
    v5.tangente = [0, 1, 0];
    v5.normal = [-1, 0, 0];
    v5.binormal = [0, 0, 1];
    v5.coordenadaTextura = v4.coordenadaTextura;

    const v6 = new Vertice();
    v6.posicion = [-base / 2, altura / 2, 0];
    v6.tangente = [0, 1, 0];
    v6.normal = [-1, 0, 0];
    v6.binormal = [0, 0, 1];
    v6.coordenadaTextura = ((this.perimetro - this.base) / this.perimetro) * this.cantRepeticionesTextura;


    // Segmento v7 - v8
    const v7 = new Vertice();
    v7.posicion = [-base / 2, altura / 2, 0];
    v7.tangente = [1, 0, 0];
    v7.normal = [0, 1, 0];
    v7.binormal = [0, 0, 1];
    v7.coordenadaTextura = v6.coordenadaTextura;

    const v8 = new Vertice();
    v8.posicion = [base / 2, altura / 2, 0];
    v8.tangente = [1, 0, 0];
    v8.normal = [0, 1, 0];
    v8.binormal = [0, 0, 1];
    v8.coordenadaTextura = this.cantRepeticionesTextura;

    this.centro.posicion = vec3.fromValues(0, 0, 0);

    [v1, v2, v3, v4, v5, v6, v7, v8].forEach(v => this.vertices.push(v));
  }

  getPerimetro() {
    return this.base * 2 + this.altura * 2;
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

export default Rectangulo;