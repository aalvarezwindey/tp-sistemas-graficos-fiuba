import { Vertice } from "../../superficie_barrido/poligono.js";

class BezierCuadratica {
  constructor(p0, p1, p2, definicion = 20) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    
    this.base0 = function(u) { return (1 - u) * (1 - u); } // (1-u)^2
		this.base1 = function(u) { return 2 * u * (1 - u); } // 2*u*(1-u)
    this.base2 = function(u) { return u * u; } // u^2
    
    this.derivada0 = function(u) { return -2 + 2 * u; } 
    this.derivada1 = function(u) { return 2 - 4 * u; }  
    this.derivada2 = function(u) { return 2 * u; }

    this.derivadaSegunda0 = function(u) { return 1; } 
    this.derivadaSegunda1 = function(u) { return -1; }  
    this.derivadaSegunda2 = function(u) { return 1; }

    this.vertices = []
    
    for (let i = 0 ; i <= definicion ; i++) {
      const t = i / definicion;

      const vertice = new Vertice();

      vertice.posicion = vec3.fromValues(
        this.base0(t) * this.p0[0] + this.base1(t) * this.p1[0] + this.base2(t) * this.p2[0],
        this.base0(t) * this.p0[1] + this.base1(t) * this.p1[1] + this.base2(t) * this.p2[1],
        this.base0(t) * this.p0[2] + this.base1(t) * this.p1[2] + this.base2(t) * this.p2[2]
      );

      vertice.tangente = vec3.fromValues(
        this.derivada0(t) * this.p0[0] + this.derivada1(t) * this.p1[0] + this.derivada2(t) * this.p2[0],
        this.derivada0(t) * this.p0[1] + this.derivada1(t) * this.p1[1] + this.derivada2(t) * this.p2[1],
        this.derivada0(t) * this.p0[2] + this.derivada1(t) * this.p1[2] + this.derivada2(t) * this.p2[2]
      );
      vec3.normalize(vertice.tangente, vertice.tangente);

      vertice.normal = vec3.fromValues(
        this.derivadaSegunda0(t) * this.p0[0] + this.derivadaSegunda1(t) * this.p1[0] + this.derivadaSegunda2(t) * this.p2[0],
        this.derivadaSegunda0(t) * this.p0[1] + this.derivadaSegunda1(t) * this.p1[1] + this.derivadaSegunda2(t) * this.p2[1],
        this.derivadaSegunda0(t) * this.p0[2] + this.derivadaSegunda1(t) * this.p1[2] + this.derivadaSegunda2(t) * this.p2[2]
      );
      vec3.normalize(vertice.normal, vertice.normal);

      // calculamos la normal como B = N x T
      vec3.cross(vertice.binormal, vertice.normal, vertice.tangente);
      vec3.normalize(vertice.binormal, vertice.binormal);

      this.vertices.push(vertice);
    }
  }
}

export default BezierCuadratica;