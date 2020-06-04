class Poligono {
  constructor() {
    this.vertices = [];
  }
}

class Vertice {
  constructor() {
    this.posicion = vec3.create();
    this.normal = vec3.create();
  }
}

export { Vertice };
export default Poligono;