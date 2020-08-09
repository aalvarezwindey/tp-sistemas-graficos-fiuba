class RecorridoParametrico {
  constructor(){
    this.cantRepeticionesTextura = 1;
  }

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

  getLongitudRecorrido() {
    throw "Should be implemented";
  }

  getCoordenadaTextura(u) {
    throw "Should be implemented";
  }
}

// Matriz de nivel = Rotacion + Traslacion => Me permite dibujar mi poligono en un determinado nivel
export default RecorridoParametrico;