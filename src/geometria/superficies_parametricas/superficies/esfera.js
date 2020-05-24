import SuperficieParametrica from "../superficie_parametrica";

class Esfera extends SuperficieParametrica {
  constructor(radio) {
    super();
    this.radio = radio;
  }

  getPosicion(u, v) {
    // (x,y,z) = (ρ cosθ sinϕ, ρ sinθ sinϕ, ρ cosϕ)
    // u E (0 ; 1)
    // v E (0 ; 1)
    const tita = u * Math.PI * 2;   // θ E (0 ; 2pi)
    const phi = v * Math.PI;        // ϕ E (0 ; pi)
    const r = this.radio;
    const x = r * Math.cos(tita) * Math.sin(phi);
    const y = r * Math.sin(tita) * Math.sin(phi);
    const z = r * Math.cos(phi);
    return [x, y, z];
  }

  getNormal(u, v) {
    // (x,y,z) = (ρ cosθ sinϕ, ρ sinθ sinϕ, ρ cosϕ)
    // u E (0 ; 1)
    // v E (0 ; 1)
    const tita = u * Math.PI * 2;   // θ E (0 ; 2pi)
    const phi = v * Math.PI;        // ϕ E (0 ; pi)
    const r = this.radio;
    const x = r * Math.cos(tita) * Math.sin(phi);
    const y = r * Math.sin(tita) * Math.sin(phi);
    const z = r * Math.cos(phi);
    const norma = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    return [x / norma, y /norma, z /norma];
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  };
}

export default Esfera;