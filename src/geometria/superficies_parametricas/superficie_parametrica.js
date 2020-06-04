import Geometry from "../geometry.js";

class SuperficieParametrica extends Geometry {
  constructor() {
    super();
  }

  _setupBuffers(definition = { filas: 100, columnas: 100 }) {
    const { filas, columnas } = definition;
    const positionBuffer = [];
    const normalBuffer = [];
    const uvBuffer = [];

    for (var i = 0; i <= filas; i++) {
      for (var j = 0; j <= columnas; j++) {

        var u = j / columnas;
        var v = i / filas;

        var pos = this.getPosicion(u, v);

        positionBuffer.push(pos[0]);
        positionBuffer.push(pos[1]);
        positionBuffer.push(pos[2]);

        var nrm = this.getNormal(u, v);

        normalBuffer.push(nrm[0]);
        normalBuffer.push(nrm[1]);
        normalBuffer.push(nrm[2]);

        var uvs = this.getCoordenadasTextura(u, v);

        uvBuffer.push(uvs[0]);
        uvBuffer.push(uvs[1]);

      }
    }

    super._setupIndexBuffer(definition);

    // Creación e Inicialización de los buffers
    const webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    const webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    const webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;

    this.buffers.position = webgl_position_buffer;
    this.buffers.normal = webgl_normal_buffer;
    this.buffers.uv = webgl_uvs_buffer;
  }

  getPosicion(u, v) {
    throw "Should be implemented";
  }

  getNormal(u, v) {
    throw "Should be implemented";
  }

  getCoordenadasTextura(u, v) {
    throw "Should be implemented";
  }
}

export default SuperficieParametrica;