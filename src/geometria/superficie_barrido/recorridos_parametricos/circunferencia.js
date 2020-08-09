import RecorridoParametrico from "../recorrido_parametrico.js";

class Circunferencia extends RecorridoParametrico {
  constructor(radio, cantRepeticionesTextura = 1, facetas = null) {
    super();
    this.radio = radio;
    this.cantRepeticionesTextura = cantRepeticionesTextura;

    if (facetas !== null) {
      this.step = 1 / facetas;
      this.verticesRegulares = [];

      for (let i = 0; i <= facetas; i++) {
        const u = i / facetas;
        const v = [
          this.radio * Math.cos(Math.PI * 2 * u),
          this.radio * Math.sin(Math.PI * 2 * u),
          0
        ];
        this.verticesRegulares.push(v);
      }

      this.facetas = facetas;
    }
  }

  // sides starts from 0
  _getSideNumber = (u) => {
    for (let i = 0; i <= this.facetas; i++) {
      const current = i / this.facetas;
      const nextOne = (i + 1) / this.facetas;
      if (u >= current && u <= nextOne) {
        return i;
      }
    }
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

  _getABforSide = (sideNumber) => {
    return {
      A: this.verticesRegulares[sideNumber],
      B: this.verticesRegulares[sideNumber + 1]
    }
  }

  _getUnormalizedBetween0and1ForSide = (sideNumber, u) => {
    return (u - (sideNumber * this.step)) * this.facetas;
  }

  getPosicionFacetado(u) {
    const sideNumber = this._getSideNumber(u);
    const { A, B } = this._getABforSide(sideNumber);
    const w = this._getUnormalizedBetween0and1ForSide(sideNumber, u);
    const pos = [
      A[0] * (1 - w) + B[0] * w,
      A[1] * (1 - w) + B[1] * w,
      A[2] * (1 - w) + B[2] * w
    ];

    return pos;
  }

  getPosicion(u) {
    if (this.facetas) return this.getPosicionFacetado(u);

    const _2pi = 2 * Math.PI;
    return [
      this.radio * Math.cos(_2pi * u),
      this.radio * Math.sin(_2pi * u),
      0
    ];
  }

  getTangente(u) {
    if (this.facetas) return this.getTangenteFacetado(u);
    const _2pi = 2 * Math.PI;
    return [
      -1 * this.radio * _2pi * Math.sin(_2pi * u),
      this.radio * _2pi * Math.cos(_2pi * u),
      0
    ];
  }

  getTangenteFacetado(u) {
    const sideNumber = this._getSideNumber(u);
    const { A, B } = this._getABforSide(sideNumber);
    const tanDirection = vec3.create();
    vec3.sub(tanDirection, A, B);
    vec3.normalize(tanDirection, tanDirection);
    return tanDirection;
  }

  getNormal(u) {
    // calculamos la normal como N = B x T
    if (this.facetas) return this.getNormalFacetado(u);
    const normal = vec3.create();
    vec3.cross(normal, this.getBinormal(u), this.getTangente(u));
    vec3.normalize(normal, normal);
    return normal;
  }

  getNormalFacetado(u) {
    const tangente = this.getTangenteFacetado(u);
    const normal = vec3.create();
    vec3.rotateZ(normal, tangente, [0, 0, 0], -Math.PI / 2);
    vec3.normalize(normal, normal);
    return normal;
  }

  getBinormalFacetado(u) {
    return [0, 0, 1];
  }

  getBinormal(u) {
    if (this.facetas) return this.getBinormalFacetado(u);

    const derivadaSegunda = this._getDerivadaSegunda(u);
    const binormal = vec3.create();
    // calculamos la binormal como B = T x r''(u)
    vec3.cross(binormal, this.getTangente(u), derivadaSegunda);
    vec3.normalize(binormal, binormal)
    return binormal;
  }

  getLongitudRecorrido() {
    return Math.PI * 2 * this.radio;
  }

  getCoordenadaTextura(u) {
    return u * this.cantRepeticionesTextura;
  }
}

export default Circunferencia;