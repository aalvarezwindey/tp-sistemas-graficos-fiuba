class Poligono {
  constructor() {
    this.vertices = [];
    this.centro = new Vertice();
  }

  getVertice(vertice, nivel) {
    throw "Debe implementarse";
  }

  getCentro(nivel) {
    throw "Debe implementarse";
  }

  // Setea una callback para que se transformen los vertices del poligono a lo largo de un recorrido
  setTransformacion(callbackTransformacion) {
    this.transformacion = callbackTransformacion;
  }
}

class Vertice {
  constructor() {
    this.posicion = vec3.create();
    this.normal = vec3.create();
    this.tangente = vec3.create();
    this.binormal = vec3.create();
  }

  clone() {
    const cloned = new Vertice();

    cloned.posicion = vec3.clone(this.posicion);
    cloned.normal = vec3.clone(this.normal);
    cloned.tangente = vec3.clone(this.tangente);
    cloned.binormal = vec3.clone(this.binormal);

    return cloned;
  }
}

export { Vertice };
export default Poligono;