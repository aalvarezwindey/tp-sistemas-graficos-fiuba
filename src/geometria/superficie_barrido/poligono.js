class Poligono {
  constructor() {
    this.vertices = [];
    this.centro = new Vertice();
    this.cantRepeticionesTextura = 1;
  }

  getVertice(vertice, nivel) {
    throw "Debe implementarse";
  }

  getCentro(nivel) {
    throw "Debe implementarse";
  }

  getPerimetro() {
    throw "Debe implementarse";
  }

  getCoordenadaTexturaParaVertice(vertice) {
    if (vertice.coordenadaTextura !== null) {
      return vertice.coordenadaTextura;
    } else {
      throw `Vertice sin coordenada textura en Rectangulo`;
    }
  }

  // Setea una callback para que se transformen los vertices del poligono a lo largo de un recorrido
  setTransformacion(callbackTransformacion) {
    this.transformacion = callbackTransformacion;
  }
}

class Vertice {
  constructor(x = 0, y = 0, z = 0) {
    this.posicion = vec3.fromValues(x, y, z);
    this.normal = vec3.fromValues(0, 1, 0);
    this.tangente = vec3.fromValues(1, 0, 0);
    this.binormal = vec3.fromValues(0, 0, 1);
    this.coordenadaTextura = null;
  }

  clone() {
    const cloned = new Vertice();

    cloned.posicion = vec3.clone(this.posicion);
    cloned.normal = vec3.clone(this.normal);
    cloned.tangente = vec3.clone(this.tangente);
    cloned.binormal = vec3.clone(this.binormal);

    return cloned;
  }

  NaT_TaB_BaN() {
    const aux1 = this.normal;
    const aux2 = this.tangente;
    const aux3 = this.binormal;

    this.normal = aux2;
    this.tangente = aux3;
    this.binormal = aux1;
  }

  NaB_TaN_BaT() {
    const aux1 = this.normal;
    const aux2 = this.tangente;
    const aux3 = this.binormal;

    this.normal = aux3;
    this.tangente = aux1;
    this.binormal = aux2;
  }

  switchNormalYBinormal() {
    const aux1 = this.normal;
    const aux2 = this.tangente;
    const aux3 = this.binormal;

    this.normal = aux3;
    this.tangente = aux2;
    this.binormal = aux1;
  }

  switchNormalYTangente() {
    const aux1 = this.normal;
    const aux2 = this.tangente;
    const aux3 = this.binormal;

    this.normal = aux2;
    this.tangente = aux1;
    this.binormal = aux2;
  }

  switchBinormalYTangenete() {
    const aux1 = this.normal;
    const aux2 = this.tangente;
    const aux3 = this.binormal;

    this.normal = aux1;
    this.tangente = aux3;
    this.binormal = aux2;
  }
}

export { Vertice };
export default Poligono;