import RecorridoParametrico from "../recorrido_parametrico.js";

class Circunferencia extends RecorridoParametrico {
  constructor(radio) {
    super();
    this.radio = radio;
  }

  _getDerivadaSegunda(u) {
    const _2pi = 2 * Math.PI;
    const derivadaSegunda = vec3.fromValues(
      -1 * this.radio * _2pi * _2pi * Math.cos(_2pi * u),
      -1 * this.radio * _2pi * _2pi * Math.sin(_2pi * u),
      0
    )
    vec3.normalize(derivadaSegunda, derivadaSegunda)
    return derivadaSegunda;
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
    // calculamos la normal como N = B x T
    const normal = vec3.create();
    vec3.cross(normal, this.getBinormal(u), this.getTangente(u));
    vec3.normalize(normal, normal);
    return normal;
  }

  getBinormal(u) {
    const derivadaSegunda = this._getDerivadaSegunda(u);
    const binormal = vec3.create();
    // calculamos la binormal como B = T x r''(u)
    vec3.cross(binormal, this.getTangente(u), derivadaSegunda);
    vec3.normalize(binormal, binormal)
    return binormal;
  }
}

export default Circunferencia;