const initTexture = async (src) => {
  return new Promise((resolve, reject) => {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
      
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
      
    // Asynchronously load an image
    var image = new Image();
    image.src = src;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      resolve(texture);
    });

    image.addEventListener('error', function(err) {
      console.log("initTexture -> err", err)
      reject(err);
    });
  })
}

class TextureManager {
  static async init() {
    const TEXTURA_PARED_CASTILLO = await initTexture('images/grey_roof_tiles_02_diff_1k.jpg');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_PARED_CASTILLO);

    const TEXTURA_LOZA_AZUL = await initTexture('images/red_slate_roof_tiles_01_diff_1k.jpg');
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_LOZA_AZUL);

    const TEXTURA_PIEDRA = await initTexture('images/rock_05_diff_1k.jpg');
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_PIEDRA);

    // const TEXTURA_MADERA_CLARA = await initTexture('images/madera_clara_1k.jpg');
    const TEXTURA_MADERA_CLARA = await initTexture('images/madera_clara_1k.jpg');
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_MADERA_CLARA);

    const TEXTURA_MADERA_OSCURA = await initTexture('images/madera_oscura_1k.jpg');
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_MADERA_OSCURA);

    const TEXTURA_CESPED = await initTexture('images/grass_1k.jpg');
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_CESPED);

    const TEXTURA_AGUA = await initTexture('images/water_1k.jpg');
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_AGUA);
    
    const TEXTURA_CESPED_2 = await initTexture('images/grass2_1k.jpg');
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_CESPED);

    const TEXTURA_CESPED_3 = await initTexture('images/grass3_1k.jpg');
    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_CESPED);

    const TEXTURA_NULA_NEGRA = await initTexture('images/black.jpg');
    gl.activeTexture(gl.TEXTURE9);
    gl.bindTexture(gl.TEXTURE_2D, TEXTURA_NULA_NEGRA);

    const texturas = [
      TEXTURA_PARED_CASTILLO,
      TEXTURA_LOZA_AZUL,
      TEXTURA_PIEDRA,
      TEXTURA_MADERA_CLARA,
      TEXTURA_MADERA_OSCURA,
      TEXTURA_CESPED,
      TEXTURA_AGUA,
      TEXTURA_CESPED_2,
      TEXTURA_CESPED_3,
      TEXTURA_NULA_NEGRA,
    ];
    return new TextureManager(texturas);
  }

  constructor(texturas) {
    this.texturas = texturas;
    this.TEXTURA_PARED_CASTILLO = texturas[0];
    this.TEXTURA_LOZA_AZUL = texturas[1];
    this.TEXTURA_PIEDRA = texturas[2];
    this.TEXTURA_MADERA_CLARA = texturas[3];
    this.TEXTURA_MADERA_OSCURA = texturas[4];
    this.TEXTURA_CESPED = texturas[5];
    this.TEXTURA_AGUA = texturas[6]
    this.TEXTURA_CESPED_2 = texturas[7]
    this.TEXTURA_CESPED_3 = texturas[8]
    this.TEXTURA_NULA_NEGRA = texturas[texturas.length - 1];
  }

  getTextureUnit(texture) {
    const idx = this.texturas.indexOf(texture);
    if (idx !== -1) {
      gl.activeTexture(gl[`TEXTURE${idx}`]);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return idx;
    } else {
      return this.getTextureUnit(this.TEXTURA_NULA_NEGRA);
    }
  }
}

export default TextureManager;