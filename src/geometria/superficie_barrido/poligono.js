class Poligono {
  constructor() {
    this.vertices = [];
    this.centro = new Vertice();
  }
}

class Vertice {
  constructor() {
    this.posicion = vec3.create();
    this.normal = vec3.create();
    this.tangente = vec3.create();
    this.binormal = vec3.create();
  }
}

export { Vertice };
export default Poligono;