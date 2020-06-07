import RecorridoParametrico from "../recorrido_parametrico.js";

class Circunferencia extends RecorridoParametrico {
  constructor(radio) {
    super();
    this.radio = radio;
  }

  getPosicion(u) {
    const _2pi = 2 * Math.PI;
    return [
      this.radio * Math.cos(_2pi * u),
      this.radio * Math.sin(_2pi * u),
      0
    ];
  }

  getTangente(u) {
    const _2pi = 2 * Math.PI;
    return [
      -1 * this.radio * _2pi * Math.sin(_2pi * u),
      this.radio * _2pi * Math.cos(_2pi * u),
      0
    ];
  }

  getNormal(u) {
    const pos = this.getPosicion(u);
    const normal = vec3.fromValues(...pos);
    vec3.normalize(normal, normal);
    return [...normal];
  }

  getBinormal(u) {
    return [0, 0, 1];
  }
}

export default Circunferencia;