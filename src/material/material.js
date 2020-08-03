class Material {
  constructor(
    materialName = 'Material', 
    configuracionPhong
  ) {
    this.name = materialName;
    

    if (configuracionPhong) {
      this.configuracionPhong = configuracionPhong;
      this.colorAmbiente = configuracionPhong.ambiente;
      this.colorDifuso = configuracionPhong.difuso;
      this._iniciarMenu();
    };
  }

  _iniciarMenu() {
    GUI_MATERIALES = GUI_MATERIALES || new dat.gui.GUI();
    GUI_MATERIALES.CONFIG_KEYS = GUI_MATERIALES.CONFIG_KEYS || {}
    GUI_MATERIALES.CONFIG_VALUES = GUI_MATERIALES.CONFIG_VALUES || {}

    this.KEYS = {
      COLOR_AMBIENTE: `${this.name} Color Ambiente`
    }

    this.VALUES = {
      [this.KEYS.COLOR_AMBIENTE]: this.colorAmbiente,
    };

    GUI_MATERIALES.CONFIG_KEYS = { ...GUI_MATERIALES.CONFIG_KEYS, ...this.KEYS };
    GUI_MATERIALES.CONFIG_VALUES = { ...GUI_MATERIALES.CONFIG_VALUES, ...this.VALUES };

    GUI_MATERIALES.remember(GUI_MATERIALES.CONFIG_VALUES);

    this.carpeta = GUI_MATERIALES.addFolder(this.name);
    this.carpeta.closed = true;

    this.carpeta.addColor(this.VALUES, this.KEYS.COLOR_AMBIENTE)
      .onChange(this.actualizarColorAmbiente);

    GUI_MATERIALES.closed = true;
  }

  actualizarColorAmbiente = color => this.colorAmbiente = color;

  activate(buffers, modelMatrix, normalMatrix) {
    const { shaderProgram } = this;
    const { position, normal, uv, index } = buffers;

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    // Activamos colores de iluminacion para modelo de Phong
    if (this.configuracionPhong) {
      gl.uniform3fv(shaderProgram.colorAmbienteUniform, this.colorAmbiente);
      gl.uniform3fv(shaderProgram.colorDifusoUniform, this.colorDifuso);
    }

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