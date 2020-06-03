class Material {
  activate(buffers, modelMatrix, normalMatrix) {
    const { shaderProgram } = this;
    const { position, normal, uv, index } = buffers;

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, uv.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normal.itemSize, gl.FLOAT, false, 0, 0);

    //gl.uniform1i(shaderProgram.useLightingUniform, true);
  }

  // Private
  // TODO: if we use the same name for attributes and uniform variables this setups may be on the shaders_manager file
  _initShader() {
    const { shaderProgram } = this;

    gl.useProgram(shaderProgram);

    // Configure shader attributes
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aUv");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // Configure uniforms
    shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
    shaderProgram.normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");
  }
}

export default Material;