import { Vertice } from "../../superficie_barrido/poligono.js";

class BSplineCuadratica {
  constructor({ puntosDeControl }, definicion = 20) {    
    this.base0 = function(u) { return 0.5 * (1 - u) * (1 - u); } // (1/2) * (1-u)^2
		this.base1 = function(u) { return 0.5 + u * (1 - u); } // 1/2 + (1-u)*u
    this.base2 = function(u) { return 0.5 * u * u; } // (1/2) u^2
    
    this.derivada0 = function(u) { return u - 1; } 
    this.derivada1 = function(u) { return 1 - 2 * u; }  
    this.derivada2 = function(u) { return u; }

    this.derivadaSegunda0 = function(u) { return 1; } 
    this.derivadaSegunda1 = function(u) { return -2; }  
    this.derivadaSegunda2 = function(u) { return 1; }

    this.vertices = []
    
    for (let terna = 0; terna <= (puntosDeControl.length - 3); terna++) {
      const p0 = puntosDeControl[terna];
      const p1 = puntosDeControl[terna + 1];
      const p2 = puntosDeControl[terna + 2];
      
      for (let i = 0 ; i <= definicion ; i++) {
        const t = i / definicion;

        const vertice = new Vertice();

        vertice.posicion = vec3.fromValues(
          this.base0(t) * p0[0] + this.base1(t) * p1[0] + this.base2(t) * p2[0],
          this.base0(t) * p0[1] + this.base1(t) * p1[1] + this.base2(t) * p2[1],
          this.base0(t) * p0[2] + this.base1(t) * p1[2] + this.base2(t) * p2[2]
        );

        vertice.tangente = vec3.fromValues(
          this.derivada0(t) * p0[0] + this.derivada1(t) * p1[0] + this.derivada2(t) * p2[0],
          this.derivada0(t) * p0[1] + this.derivada1(t) * p1[1] + this.derivada2(t) * p2[1],
          this.derivada0(t) * p0[2] + this.derivada1(t) * p1[2] + this.derivada2(t) * p2[2]
        );
        vec3.normalize(vertice.tangente, vertice.tangente);

        vertice.normal = vec3.fromValues(
          this.derivadaSegunda0(t) * p0[0] + this.derivadaSegunda1(t) * p1[0] + this.derivadaSegunda2(t) * p2[0],
          this.derivadaSegunda0(t) * p0[1] + this.derivadaSegunda1(t) * p1[1] + this.derivadaSegunda2(t) * p2[1],
          this.derivadaSegunda0(t) * p0[2] + this.derivadaSegunda1(t) * p1[2] + this.derivadaSegunda2(t) * p2[2]
        );
        vec3.normalize(vertice.normal, vertice.normal);

        // calculamos la normal como B = N x T
        vec3.cross(vertice.binormal, vertice.normal, vertice.tangente);
        vec3.normalize(vertice.binormal, vertice.binormal);

        this.vertices.push(vertice);
      }
    }
  }
}

export default BSplineCuadratica;