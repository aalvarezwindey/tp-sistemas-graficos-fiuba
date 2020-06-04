import Geometry from "../geometry.js";

class SuperficieBarrido extends Geometry {
  constructor(poligono, recorrido) {
    super();
    this.poligono = poligono;
    this.recorrido = recorrido;
    this._setupBuffers();
  }

  _setupBuffers(definition = { filas: 100, columnas: 100 }) {
    const { filas, columnas } = definition;
    const niveles = filas;
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
      mat4.transpose(matrizDeNivel, matrizDeNivel);

      for (var idxVertice = 0; idxVertice < cantidadVertices; idxVertice++) {
        const vertice = this.poligono.vertices[idxVertice];

        const posicionTransformada = vec4.create();
        vec4.transformMat4(posicionTransformada, vec4.fromValues(...vertice.posicion, 1), matrizDeNivel)
        bufferDePosicion.push(
          posicionTransformada[0],
          posicionTransformada[1],
          posicionTransformada[2]
        );

        // TODO: calcular buffer de normal
      }
    }

    super._setupIndexBuffer(definition);

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
}

export default SuperficieBarrido;