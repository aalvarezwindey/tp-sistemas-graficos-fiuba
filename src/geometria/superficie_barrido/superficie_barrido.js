import Geometry from "../geometry.js";

class SuperficieBarrido extends Geometry {
  constructor(poligono, recorrido, cerrado = true, filasQuads = 100, swapUV = false) {
    super();
    this.poligono = poligono;
    this.recorrido = recorrido;
    this.cerrado = cerrado;
    this._setupBuffers(filasQuads, swapUV);
  }

  _setupBuffers(filasQuads = 100, swapUV) {
    const niveles = filasQuads + 1;
    this.niveles = niveles;
    const cantidadVertices = this.poligono.vertices.length;

    const bufferDePosicion = [];
    const bufferDeNormal = [];
    const bufferDeUV = [];

    // Recordar que los index buffers generan una grilla de Filas x Columnas de QUADS
    super._setupIndexBuffer({
      filas: this.cerrado ? niveles + 4 : niveles,
      columnas: cantidadVertices - 1,
    });

    const { minX, maxX, maxY, minY } = this._poligonoMinAndMaxXY();

    for (var nivel = 0; nivel <= niveles; nivel++) {
      const u = nivel / niveles;
      const posicionRecorrido = this.recorrido.getPosicion(u);
      const tangenteRecorrido = this.recorrido.getTangente(u);
      const normalRecorrido = this.recorrido.getNormal(u);
      const binormalRecorrido = this.recorrido.getBinormal(u);

      const matrizDeNivel = mat4.fromValues(
        ...normalRecorrido, 0,
        ...binormalRecorrido, 0,
        ...tangenteRecorrido, 0,
        ...posicionRecorrido, 1
      );

      const matrizDeNormales = mat3.fromValues(
        ...normalRecorrido,
        ...binormalRecorrido,
        ...tangenteRecorrido
      );

      // Tejido de primer tapa
      if (nivel === 0 && this.cerrado) {
        this.poligono.vertices.forEach(v => {
          const centro = this.poligono.getCentro(u);
          vec3.negate(centro.normal, v.binormal);
          
          this._tejerNivelParaVertice({
            vertice: centro,
            matrizDeNivel,
            matrizDeNormales,
            bufferDePosicion,
            bufferDeNormal,
            bufferDeUV
          });

          this._agregarUVdeCentroAlBuffer({ centro, minX, maxX, minY, maxY, swapUV, bufferDeUV });
        });

        // Volvemos a tejer el nivel de la tapa para mapear el poligono a la textura
        this._tejidoNormalDeNivel({ u, nivel, matrizDeNivel, matrizDeNormales, bufferDePosicion, bufferDeNormal });
        this._mapearUVenPoligono({ minX, maxX, minY, maxY, bufferDeUV, swapUV });
      }
      // END PRIMER TAPA


      // TEJIDO NORMAL
      this._tejidoNormalDeNivel({ u, nivel, matrizDeNivel, matrizDeNormales, bufferDePosicion, bufferDeNormal });
      this._llenarBufferUVParaNivelNormal({ u, swapUV, bufferDeUV });
      // END TEJIDO NORMAL




      // Tejido de última tapa
      if (nivel === niveles && this.cerrado) {
        // Volvemos a tejer el nivel de la tapa para mapear el poligono a la textura
        this._tejidoNormalDeNivel({ u, nivel, matrizDeNivel, matrizDeNormales, bufferDePosicion, bufferDeNormal });
        this._mapearUVenPoligono({ minX, maxX, minY, maxY, bufferDeUV, swapUV });

        this.poligono.vertices.forEach(v => {
          const centro = this.poligono.getCentro(u);
          centro.normal = v.binormal;
          
          this._tejerNivelParaVertice({
            vertice: centro,
            matrizDeNivel,
            matrizDeNormales,
            bufferDePosicion,
            bufferDeNormal
          });
          this._agregarUVdeCentroAlBuffer({ centro, minX, maxX, minY, maxY, swapUV, bufferDeUV });
        });
      }
    }
    // END ULTIMA TAPA





    // Creación e Inicialización de los buffers
    const webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferDePosicion), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = bufferDePosicion.length / 3;

    const webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferDeNormal), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = bufferDeNormal.length / 3;

    const webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferDeUV), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = bufferDeUV.length / 2;
    this.buffers.uv = webgl_uvs_buffer;

    this.buffers.position = webgl_position_buffer;
    this.buffers.normal = webgl_normal_buffer;
  }

  _agregarUVdeCentroAlBuffer({ centro, minX, maxX, minY, maxY, swapUV, bufferDeUV }) {
    const xCentro = centro.posicion[0];
    const yCentro = centro.posicion[1];
    const uTextCentro = (xCentro - minX) / (maxX - minX);
    const vTextCentro = (yCentro - minY) / (maxY - minY);
    if (swapUV) {
      bufferDeUV.push(vTextCentro, uTextCentro);
    } else {
      bufferDeUV.push(uTextCentro, vTextCentro);
    }
  }

  _mapearUVenPoligono({ minX, maxX, minY, maxY, bufferDeUV, swapUV }) {
    this.poligono.vertices.forEach(v => {
      try {
        const x = v.posicion[0];
        const y = v.posicion[1];
        const uText = (x - minX) / (maxX - minX);
        const vText = (y - minY) / (maxY - minY);
        if (swapUV) {
          bufferDeUV.push(uText, vText);
        } else {
          bufferDeUV.push(vText, uText);
        }
      } catch(err) {
        // console.log("SuperficieBarrido -> _setupBuffers -> err", err)
        bufferDeUV.push(0, 0)
      }
    });
  }
  
  _tejidoNormalDeNivel({ u, nivel, matrizDeNivel, matrizDeNormales, bufferDePosicion, bufferDeNormal }) {
    this.poligono.vertices.forEach(vertice => {
      let v;
      // Tejido normal de nivel
      const verticeTransformadoSegunNivel = this.poligono.getVertice(vertice, u);
      v = verticeTransformadoSegunNivel.clone();
      
      if (this.cerrado && nivel === 0) {
        vec3.negate(v.normal, v.binormal);
      }

      if (this.cerrado && nivel === this.niveles) {
        v.normal = v.binormal;
      }

      this._tejerNivelParaVertice({
        vertice: v,
        matrizDeNivel,
        matrizDeNormales,
        bufferDePosicion,
        bufferDeNormal
      });
    });
  }

  _llenarBufferUVParaNivelNormal({ u, swapUV, bufferDeUV }) {
    this.poligono.vertices.forEach(vertice => {
      try {
        const uText = this.poligono.getCoordenadaTexturaParaVertice(vertice);
        const vText = this.recorrido.getCoordenadaTextura(u);
        if (swapUV) {
          bufferDeUV.push(vText, uText);
        } else {
          bufferDeUV.push(uText, vText);
        }
      } catch(err) {
        // console.log("SuperficieBarrido -> _setupBuffers -> err", err)
        bufferDeUV.push(0, 0)
      }
    })
  }

  _poligonoMinAndMaxXY() {
    let minX, minY, maxX, maxY;
    minX = Infinity;
    minY = Infinity;
    maxX = -Infinity;
    maxY = -Infinity;

    this.poligono.vertices.forEach(v => {
      const x = v.posicion[0];
      const y = v.posicion[1];
      if (x > maxX) maxX = x;
      if (x < minX) minX = x;
      if (y > maxY) maxY = y;
      if (y < minY) minY = y;
    });

    return { minX, maxX, minY, maxY };
  }

  _tejerNivelParaVertice = ({ vertice, matrizDeNivel, matrizDeNormales, bufferDePosicion, bufferDeNormal }) => {
    // Calculamos la posicion con la matriz de nivel
    const posicionTransformada = vec4.create();
    vec4.transformMat4(
      posicionTransformada,
      vec4.fromValues(...vertice.posicion, 1),
      matrizDeNivel
    );

    // Descartamos el cuarto valor del vector
    bufferDePosicion.push(
      posicionTransformada[0],
      posicionTransformada[1],
      posicionTransformada[2]
    );

    const normalTransformada = vec3.create();
    vec3.transformMat3(
      normalTransformada,
      vec3.fromValues(...vertice.normal),
      matrizDeNormales
    );

    bufferDeNormal.push(
      normalTransformada[0],
      normalTransformada[1],
      normalTransformada[2]
    );
  }
}

export default SuperficieBarrido;