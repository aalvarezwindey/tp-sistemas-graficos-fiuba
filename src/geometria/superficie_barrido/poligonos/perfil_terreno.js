import Poligono, { Vertice } from "../poligono.js";

class PerfilTerreno extends Poligono {
  constructor(profundidadAgua, radioAgua, largoTerreno, cantRepeticionesTextura = 1) {
    super();
    this.cantRepeticionesTextura = cantRepeticionesTextura
    const v0 = new Vertice();
    v0.posicion = [0, 0, 0];

    const v1 = new Vertice();
    v1.posicion = [radioAgua, 0, 0];

    const v2 = new Vertice();
    v2.posicion = [radioAgua, profundidadAgua, 0];

    const v3 = new Vertice();
    v3.posicion = [radioAgua + largoTerreno, profundidadAgua, 0];

    this.vertices.push(v0, v1, v2, v3);

    const largo = radioAgua + largoTerreno;

    this.vertices.forEach(v => {
      v.normal = [0, 1, 0];
      v.tangente = [1, 0, 0];
      v.binormal = [0, 0, 1];
      v.coordenadaTextura = (v.posicion[0] / largo) * this.cantRepeticionesTextura;
    })

    this.centro.posicion = vec3.fromValues(0, 0, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);
  }

  getVertice(vertice, nivel) {
    if (!this.transformacion) return vertice;

    return this.transformacion(vertice, nivel);
  }

  getCentro(nivel) {
    return this.centro;
  }
}

export default PerfilTerreno;