import Poligono, { Vertice } from "../poligono.js";

const _2pi = Math.PI * 2;

class Circulo extends Poligono {
  constructor(radio, definicion = 100) {
    super();

    this.radio = radio;

    for (let i = 0; i <= definicion; i++) {
      const u = i / definicion;
      const vertice = new Vertice();
      vertice.posicion = this._getPosicion(u);
      vertice.normal = this._getNormal(u);
      vertice.tangente = this._getTangente(u);
      vertice.binormal = [0, 0, 1];
      this.vertices.push(vertice);
    }

    this.centro.posicion = vec3.fromValues(0, 0, 0);
    this.centro.normal = vec3.fromValues(0, 0, 1);
  }

  _getPosicion(u) {
    return [
      this.radio * Math.cos(_2pi * u),
      this.radio * Math.sin(_2pi * u),
      0
    ]
  }

  _getNormal(u) {
    const n = vec3.create();
    vec3.normalize(n, this._getPosicion(u));
    return n;
  }

  _getTangente(u) {
    const normal = this._getNormal(u);
    const tangente = vec3.create();
    vec3.rotateZ(tangente, normal, [0, 0, 0], Math.PI / 2);
    return tangente;
  }

  getVertice(vertice, nivel) {
    if (!this.transformacion) return vertice;
  }

  getCentro(nivel) {
    if (!this.transformacion) return this.centro;
  }
}

export default Circulo