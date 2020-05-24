import './superficies_parametricas/index';

function generarSuperficie(superficie, filas, columnas) {
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i = 0; i <= filas; i++) {
        for (var j = 0; j <= columnas; j++) {

            var u = j / columnas;
            var v = i / filas;

            var pos = superficie.getPosicion(u, v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm = superficie.getNormal(u, v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs = superficie.getCoordenadasTextura(u, v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    indexBuffer = [];

    function inidiceDelVertice_ij(i, j) {
        var cant_vertices_por_fila = columnas + 1;
        return j * cant_vertices_por_fila + i;
    }

    function agregarIndicesParaQuad_ij(idx_buffer, i, j) {
        var v_ij = inidiceDelVertice_ij(i, j);
        var v_i1_j = inidiceDelVertice_ij(i + 1, j);
        var v_i_j1 = inidiceDelVertice_ij(i, j + 1);
        var v_i1_j1 = inidiceDelVertice_ij(i + 1, j + 1);

        idx_buffer.push(v_ij, v_i1_j, v_i_j1, v_i1_j1);
    }

    for (j = 0; j < filas; j++) {
        for (i = 0; i < columnas; i++) {
            agregarIndicesParaQuad_ij(indexBuffer, i, j);

            // Si llegamos al borde debemos hacer los triángulos degenerados
            if (i === columnas - 1) {
                var v_i1_j1 = inidiceDelVertice_ij(i + 1, j + 1);
                var v_0_j1 = inidiceDelVertice_ij(0, j + 1);

                indexBuffer.push(v_i1_j1, v_i1_j1, v_0_j1, v_0_j1);
            }
        }
    }

    // Creación e Inicialización de los buffers
    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;

    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos) {
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo != "wireframe") {
        gl.uniform1i(shaderProgram.useLightingUniform, (lighting == "true"));
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    if (modo != "smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform, false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function crearGeometria({ filas = 100, columnas = 100}) {
  const esfera = new Esfera(1);

  mallaDeTriangulosEsfera = generarSuperficie(esfera, filas, columnas);
}

function dibujarGeometria() {
  dibujarMalla(mallaDeTriangulosEsfera);
}
