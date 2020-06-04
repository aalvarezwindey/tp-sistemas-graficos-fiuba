class Geometry {
  constructor() {
    this.buffers = {};
  }

  _setupIndexBuffer(definicion = { filas: 100, columnas: 100 }) {
    const { filas, columnas } = definicion;
    // Buffer de indices de los triángulos
    const indexBuffer = [];
    for (var i = 0; i < filas; i++) {
      for (var j = 0; j < columnas; j++) {
        if (j === 0) {
          indexBuffer.push(j + (i* (columnas+1)));
          indexBuffer.push(j + ((i+1) * (columnas+1)));
        }

        indexBuffer.push(j + 1 + (i* (columnas+1)));
        indexBuffer.push(j + 1 + ((i+1) * (columnas+1)));

        if ((j == columnas - 1) && (i+1 < filas)) {
          indexBuffer.push(j + 1 + ((i+1) * (columnas+1)));
          indexBuffer.push(((i+1) * (columnas+1)));
        }
      }
    }

    const webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    this.buffers.index = webgl_index_buffer;
  }
}

export default Geometry;