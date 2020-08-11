class Material {
  constructor(
    materialName = 'Material', 
    configuracionPhong
  ) {
    this.name = materialName;
    this.posicionCamara = [0, 0, 0];

    if (configuracionPhong) {
      this.configuracionPhong = configuracionPhong;
      this.colorAmbiente = configuracionPhong.ambiente;
      this.colorDifuso = configuracionPhong.difuso;
      this.colorEspecular = configuracionPhong.especular || [0, 0, 0]; // Los colores no reflejan por default (i.e. ks = (0, 0, 0))
      this.glossiness = configuracionPhong.glossiness || 1; // Usamos blanco como Ks default
      this._iniciarMenu();
    };
  }

  _colorArrayNormalized = colorArr => colorArr.map(val => val >= 1 ? val / 255.0 : val);
  _colorrArrayIn255 = colorArr => colorArr.map(val => val < 1 ? val * 255.0 : val);

  _iniciarMenu() {
    GUI_MATERIALES = GUI_MATERIALES || new dat.gui.GUI();
    GUI_MATERIALES.CONFIG_KEYS = GUI_MATERIALES.CONFIG_KEYS || {}
    GUI_MATERIALES.CONFIG_VALUES = GUI_MATERIALES.CONFIG_VALUES || {}

    this.KEYS = {
      COLOR_AMBIENTE: `${this.name} Color Ambiente`,
      COLOR_DIFUSO: `${this.name} Color Difuso`,
      COLOR_ESPECULAR: `${this.name} Color Especular [ks]`,
      GLOSSINESS: `${this.name} Glossiness [α]`
    }

    this.VALUES = {
      [this.KEYS.COLOR_AMBIENTE]: this.colorAmbiente,
      [this.KEYS.COLOR_DIFUSO]: this.colorDifuso,
      [this.KEYS.COLOR_ESPECULAR]: this.colorEspecular,
      [this.KEYS.GLOSSINESS]: this.glossiness,
    };

    GUI_MATERIALES.CONFIG_KEYS = { ...GUI_MATERIALES.CONFIG_KEYS, ...this.KEYS };
    GUI_MATERIALES.CONFIG_VALUES = { ...GUI_MATERIALES.CONFIG_VALUES, ...this.VALUES };

    GUI_MATERIALES.remember(GUI_MATERIALES.CONFIG_VALUES);

    this.carpeta = GUI_MATERIALES.addFolder(this.name);
    this.carpeta.closed = true;

    this.carpeta.addColor(this.VALUES, this.KEYS.COLOR_AMBIENTE)
      .onChange(this.actualizarColorAmbiente);

    this.carpeta.addColor(this.VALUES, this.KEYS.COLOR_DIFUSO)
      .onChange(this.actualizarColorDifuso);

    this.carpeta.addColor(this.VALUES, this.KEYS.COLOR_ESPECULAR)
      .onChange(this.actualizarColorEspecular);

    this.carpeta.add(this.VALUES, this.KEYS.GLOSSINESS)
      .min(1)
      .max(256)
      .step(1)
      .onChange(this.actualizarGlossiness);


    GUI_MATERIALES.closed = false;
    GUI_MATERIALES.width = 515;
  }

  actualizarColorDifuso = color => {
    this.colorDifuso = color;
  };

  actualizarColorAmbiente = color => {
    this.colorAmbiente = color;
  };

  actualizarColorEspecular = color => {
    this.colorEspecular = color;
  };

  actualizarGlossiness = newGlossiness => {
    this.glossiness = newGlossiness;
  }


  activate(buffers, modelMatrix, normalMatrix) {
    const { shaderProgram } = this;
    const { position, normal, uv } = buffers;

    gl.useProgram(shaderProgram);

    gl.uniformMatrix4fv(shaderProgram.modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalMatrixUniform, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, position.itemSize, gl.FLOAT, false, 0, 0);

    // Activamos colores de iluminacion para modelo de Phong
    if (this.configuracionPhong) {
      gl.uniform3fv(shaderProgram.colorAmbienteUniform, this._colorArrayNormalized(this.colorAmbiente));
      gl.uniform3fv(shaderProgram.colorDifusoUniform, this._colorArrayNormalized(this.colorDifuso));
      gl.uniform3fv(shaderProgram.colorEspecularUniform, this._colorArrayNormalized(this.colorEspecular));
      gl.uniform1f(shaderProgram.glossinessUniform, this.glossiness);
    }

    if (uv && shaderProgram.textureCoordAttribute !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, uv);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, uv.itemSize, gl.FLOAT, false, 0, 0);
      // Tell the shader to use texture unit N for u_texture
      var textureLocation = gl.getUniformLocation(shaderProgram, "u_texture1");
      gl.uniform1i(textureLocation, TEXTURE_MANAGER.getTextureUnit(this.textura));

      var textureLocation2 = gl.getUniformLocation(shaderProgram, "u_texture2");
      gl.uniform1i(textureLocation2, TEXTURE_MANAGER.getTextureUnit(this.textura_2));

      var textureLocation3 = gl.getUniformLocation(shaderProgram, "u_texture3");
      gl.uniform1i(textureLocation3, TEXTURE_MANAGER.getTextureUnit(this.textura_3));
    }

    if (normal && shaderProgram.vertexNormalAttribute !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, normal);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normal.itemSize, gl.FLOAT, false, 0, 0);
    }
  }
}

export default Material;