class Material {
  activate(buffers, modelMatrix, normalMatrix) {
    const { shaderProgram } = this;
    const { position, normal, uv, index } = buffers;

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    if (uv && shaderProgram.textureCoordAttribute !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, uv);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, uv.itemSize, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normal.itemSize, gl.FLOAT, false, 0, 0);

    //gl.uniform1i(shaderProgram.useLightingUniform, true);
  }
}

export default Material;