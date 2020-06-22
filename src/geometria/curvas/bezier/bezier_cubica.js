import { Vertice } from "../../superficie_barrido/poligono.js";

class BezierCubica {
  constructor(p0, p1, p2, p3, definicion = 20) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    
    this.base0 = function(u) { return (1-u)*(1-u)*(1-u); }  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3
		this.base1 = function(u) { return 3*(1-u)*(1-u)*u; }    // 3*(1-u)*(u-u2) , 3*(u-u2-u2+u3), 3u -6u2+2u3
    this.base2 = function(u) { return 3*(1-u)*u*u; }        // 3u2-3u3
    this.base3 = function(u) { return u*u*u; }              // u^3
    
    this.derivada0 = function(u) { return -3*u*u+6*u-3;}   // -3u2 +6u -3
    this.derivada1 = function(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3
    this.derivada2 = function(u) { return -9*u*u+6*u;}		 // -9u2 +6u
    this.derivada3 = function(u) { return 3*u*u; }			   // 3u2

    this.derivadaSegunda0 = function(u) { return (-6 * u) + 6; } 
    this.derivadaSegunda1 = function(u) { return (18 * u) - 12; }  
    this.derivadaSegunda2 = function(u) { return (-18 * u) + 6; }
    this.derivadaSegunda3 = function(u) { return (6 * u); }

    this.vertices = []
    
    for (let i = 0 ; i <= definicion ; i++) {
      const t = i / definicion;

      const vertice = new Vertice();

      vertice.posicion = vec3.fromValues(
        this.base0(t) * this.p0[0] + this.base1(t) * this.p1[0] + this.base2(t) * this.p2[0] + this.base3(t) * this.p3[0],
        this.base0(t) * this.p0[1] + this.base1(t) * this.p1[1] + this.base2(t) * this.p2[1] + this.base3(t) * this.p3[1],
        this.base0(t) * this.p0[2] + this.base1(t) * this.p1[2] + this.base2(t) * this.p2[2] + this.base3(t) * this.p3[2]
      );

      vertice.tangente = vec3.fromValues(
        this.derivada0(t) * this.p0[0] + this.derivada1(t) * this.p1[0] + this.derivada2(t) * this.p2[0] + this.derivada3(t) * this.p3[0],
        this.derivada0(t) * this.p0[1] + this.derivada1(t) * this.p1[1] + this.derivada2(t) * this.p2[1] + this.derivada3(t) * this.p3[1],
        this.derivada0(t) * this.p0[2] + this.derivada1(t) * this.p1[2] + this.derivada2(t) * this.p2[2] + this.derivada3(t) * this.p3[2]
      );
      vec3.normalize(vertice.tangente, vertice.tangente);

      vertice.normal = vec3.fromValues(
        this.derivadaSegunda0(t) * this.p0[0] + this.derivadaSegunda1(t) * this.p1[0] + this.derivadaSegunda2(t) * this.p2[0] + this.derivadaSegunda3(t) * this.p3[0],
        this.derivadaSegunda0(t) * this.p0[1] + this.derivadaSegunda1(t) * this.p1[1] + this.derivadaSegunda2(t) * this.p2[1] + this.derivadaSegunda3(t) * this.p3[1],
        this.derivadaSegunda0(t) * this.p0[2] + this.derivadaSegunda1(t) * this.p1[2] + this.derivadaSegunda2(t) * this.p2[2] + this.derivadaSegunda3(t) * this.p3[2]
      );
      vec3.normalize(vertice.normal, vertice.normal);

      // calculamos la normal como B = N x T
      vec3.cross(vertice.binormal, vertice.normal, vertice.tangente);
      vec3.normalize(vertice.binormal, vertice.binormal);

      this.vertices.push(vertice);
    }
  }
}

export default BezierCubica;