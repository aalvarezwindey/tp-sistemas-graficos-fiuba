import SuperficieParametrica from "../superficie_parametrica.js";

class BombaAcuatica extends SuperficieParametrica {
  constructor(radio) {
    super();
    this.radio = radio;
  }

  getPosicion(alfa, beta) {
    var r = this.radio;
    var nx = Math.sin(beta) * Math.sin(alfa);
    var ny = Math.sin(beta) * Math.cos(alfa);
    var nz = Math.cos(beta);


    var g = beta % 0.5;
    var h = alfa % 1;
    var f = 1;

    if (g < 0.25) f = 0.95;
    if (h < 0.5) f = f * 0.95;

    var x = nx * r * f;
    var y = ny * r * f;
    var z = nz * r * f;

    return [x, y, z];
  }

  getNormal(alfa, beta) {
    var p = this.getPosicion(alfa, beta);
    var v = vec3.create();
    vec3.normalize(v, p);

    var delta = 0.05;
    var p1 = this.getPosicion(alfa, beta);
    var p2 = this.getPosicion(alfa, beta + delta);
    var p3 = this.getPosicion(alfa + delta, beta);

    var v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    var v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    var n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }

  getCoordenadasTextura(u, v) {
    return [u, v];
  };
}

export default BombaAcuatica;