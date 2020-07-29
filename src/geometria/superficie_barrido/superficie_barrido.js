import Geometry from "../geometry.js";

class SuperficieBarrido extends Geometry {
  constructor(poligono, recorrido, cerrado = true, filasQuads = 100) {
    super();
    this.poligono = poligono;
    this.recorrido = recorrido;
    this.cerrado = cerrado;
    this._setupBuffers(filasQuads);
  }

  _setupBuffers(filasQuads = 100) {
    const niveles = filasQuads + 1;
    const cantidadVertices = this.poligono.vertices.length;

    const bufferDePosicion = [];
    const bufferDeNormal = [];
    const bufferDeUV = [];

    // Recordar que los index buffers generan una grilla de Filas x Columnas de QUADS
    super._setupIndexBuffer({
      filas: this.cerrado ? niveles + 2 : niveles,
      columnas: cantidadVertices - 1,
    });

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
            bufferDeNormal
          });
        });
      }

      this.poligono.vertices.forEach(vertice => {
        let v;
        // Tejido normal de nivel
        const verticeTransformadoSegunNivel = this.poligono.getVertice(vertice, u);
        v = verticeTransformadoSegunNivel.clone();
        
        if (this.cerrado && nivel === 0) {
          vec3.negate(v.normal, v.binormal);
        }

        if (this.cerrado && nivel === niveles) {
          v.normal = v.binormal;
        }

        this._tejerNivelParaVertice({
          vertice: v,
          matrizDeNivel,
          matrizDeNormales,
          bufferDePosicion,
          bufferDeNormal
        });
      })

      // Tejido de última tapa
      if (nivel === niveles && this.cerrado) {
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
        });
      }
    }

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

    // TODO define uv
    /* const webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2; */

    this.buffers.position = webgl_position_buffer;
    this.buffers.normal = webgl_normal_buffer;
    // this.buffers.uv = webgl_uvs_buffer;
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