import Geometry from "../geometry.js";

class SuperficieBarrido extends Geometry {
  constructor(poligono, recorrido, cerrado = false) {
    super();
    this.poligono = poligono;
    this.recorrido = recorrido;
    this.cerrado = cerrado;
    this._setupBuffers();
  }

  _setupBuffers(filas = 100) {
    const niveles = this.cerrado ? filas + 2 : filas;
    const cantidadVertices = this.poligono.vertices.length;
    super._setupIndexBuffer({
      filas: niveles,
      columnas: cantidadVertices,
    });

    const bufferDePosicion = [];
    const bufferDeNormal = [];
    const bufferDeUV = [];

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
      )

      for (var idxVertice = 0; idxVertice < cantidadVertices; idxVertice++) {
        // Tomamos el vertice correspondiente
        let vertice = this.poligono.vertices[idxVertice];
        let normalVertice = vertice.normal

        if ((nivel === 0 || nivel === niveles) && this.cerrado) {
          console.log('CERRANDING')
          vertice = this.poligono.centro;
          normalVertice = vertice.normal;

          if (nivel === niveles) {
            // La normal de la tapa final tiene el sentido contrario
            vec3.inverse(normalVertice, normalVertice)
          }
        }



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
          vec3.fromValues(...normalVertice),
          matrizDeNormales
        );
      }
    }

    super._setupIndexBuffer({ filas: niveles, columnas: cantidadVertices });

    // Creación e Inicialización de los buffers
    const webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferDePosicion), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = bufferDePosicion.length / 3;

    const webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    // TODO: replace for normal buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferDePosicion), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = bufferDePosicion.length / 3;

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

  _completarBuffersDePosicionYNormalParaBorde(matrizDeNivel, matrizDeNormales) {
    for (var vertex=0; vertex <= this.vertices; vertex++) {
      var u = vertex / this.vertices;

      var center_vertex_pos = this.shape.getCenterPosition(u);
      var normalCentro = this.shape.getCenterNormal(u);

      var posicionCentroTransformado = vec4.create();
      var normalCentroTransformada = vec3.create();

      var vec4_center_vertex_pos = vec4.fromValues(center_vertex_pos[0], center_vertex_pos[1], center_vertex_pos[2], 1);
      vec4.transformMat4(posicionCentroTransformado, vec4_center_vertex_pos, matrizDeNivel);

      vec3.transformMat3(normalCentroTransformada, normalCentro, matrizDeNormales);

      this.positionBuffer.push(posicionCentroTransformado[0]);
      this.positionBuffer.push(posicionCentroTransformado[1]);
      this.positionBuffer.push(posicionCentroTransformado[2]);

      this.normalBuffer.push(normalCentroTransformada[0]);
      this.normalBuffer.push(normalCentroTransformada[1]);
      this.normalBuffer.push(normalCentroTransformada[2]);
    }
  }
}

export default SuperficieBarrido;