class Recorrido {
  getPosicion(u) {
    throw "Should be implemented";
  }

  getTangente(u) {
    throw "Should be implemented";
  }

  getNormal(u) {
    throw "Should be implemented";
  }

  getBinormal(u) {
    throw "Should be implemented";
  }
}

// Matriz de nivel = Rotacion + Traslacion => Me permite dibujar mi poligono en un determinado nivel
export default Recorrido;