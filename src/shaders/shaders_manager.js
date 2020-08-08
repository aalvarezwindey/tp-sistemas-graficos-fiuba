const DEFAULT = 'default';
const MADERA_CLARA = 'madera_clara';
const MADERA_OSCURA = 'madera_oscura';
const HILO = 'hilo';
const PIEDRA = 'piedra';
const ROJO = 'eje_rojo';
const VERDE = 'eje_verde';
const AZUL = 'eje_azul';
const BEIGE = 'beige';
const LOZA_AZUL = 'loza_azul';
const CESPED = 'cesped';
const AGUA = 'agua';
const PRUEBA_NORMALES = 'prueba_normales';
const LUZ = 'luz';
const VIDRIO = 'vidrio';

const USES_PHONG_FRAGMENT_SHADER = {
  [MADERA_CLARA]: true,
  [MADERA_OSCURA]: true,
  [HILO]: true,
  [PIEDRA]: true,
  [BEIGE]: true,
  [LOZA_AZUL]: true,
  [CESPED]: true,
  [AGUA]: true,
  [VIDRIO]: true,
}

const SHADERS_FILE_NAMES = [
  DEFAULT,
  MADERA_CLARA,
  MADERA_OSCURA,
  HILO,
  PIEDRA,
  ROJO,
  VERDE,
  AZUL,
  BEIGE,
  LOZA_AZUL,
  CESPED,
  AGUA,
  PRUEBA_NORMALES,
  LUZ,
  VIDRIO
];

class ShadersManager {
  // Shaders IDs getters
  static get DEFAULT() { return DEFAULT }
  static get MADERA_CLARA() { return MADERA_CLARA }
  static get MADERA_OSCURA() { return MADERA_OSCURA }
  static get HILO() { return HILO }
  static get PIEDRA() { return PIEDRA }
  static get ROJO() { return ROJO }
  static get VERDE() { return VERDE }
  static get AZUL() { return AZUL }
  static get BEIGE() { return BEIGE }
  static get LOZA_AZUL() { return LOZA_AZUL }
  static get CESPED() { return CESPED }
  static get AGUA() { return AGUA }
  static get PRUEBA_NORMALES() { return PRUEBA_NORMALES }
  static get LUZ() { return LUZ }
  static get VIDRIO() { return VIDRIO }

  static async init(glContext, baseUrl = 'src/shaders/glsl') {
    const results = await Promise.all(SHADERS_FILE_NAMES.map(fileName => {
      return new Promise((resolve, reject) => {
        const fs_file_name = USES_PHONG_FRAGMENT_SHADER[fileName] ? 'phong' : fileName
        Promise.all([
          fetch(`${baseUrl}/fs_${fs_file_name}.glsl`),
          fetch(`${baseUrl}/vs_${'default'}.glsl`)
        ])
        .then(([ fragmentResult, vertexResult ]) => {
          if (fragmentResult.ok && vertexResult.ok) {
            Promise.all([fragmentResult.text(), vertexResult.text()])
            .then(([ fragmentCode, vertexCode ]) => {
              resolve({ fragmentCode, vertexCode, fileName });
            });
          } else {
            console.error('ERROR fragment shader file', fileName, fragmentResult);
            console.error('ERROR vertex shader file', fileName, vertexResult);
          }
        })
        .catch(error => {
          console.error('ERROR fetching', fileName, error);
          reject(fileName);
        })
      });
    }));

    return new ShadersManager(glContext, results);
  }

  constructor(glContext, sourceCodes) {
    this.gl = glContext;
    this.programs = {}

    sourceCodes.forEach(sourceCode => {
      const { fragmentCode, vertexCode, fileName } = sourceCode;

      // Create GL shaders
      const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);

      // Add source code
      this.gl.shaderSource(fragmentShader, fragmentCode);
      this.gl.shaderSource(vertexShader, vertexCode);

      // Compile shaders
      this.gl.compileShader(fragmentShader);
      if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
        console.error(`Fragment shader compilation for ${fileName} failed`, this.gl.getShaderInfoLog(fragmentShader));
        throw new Error('Some fragment shader compilation failed');
      }

      this.gl.compileShader(vertexShader);
      if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
        console.error(`Vertex shader compilation for ${fileName} failed`, this.gl.getShaderInfoLog(vertexShader));
        throw new Error('Some vertex shader compilation failed');
      }

      // Program creation and link
      const glProgram = this.gl.createProgram();
      this.gl.attachShader(glProgram, vertexShader);
      this.gl.attachShader(glProgram, fragmentShader);
      this.gl.linkProgram(glProgram);

      if (!this.gl.getProgramParameter(glProgram, this.gl.LINK_STATUS)) {
        console.error(`Sharder link for ${fileName} failed`);
        throw new Error('Some shader link failed');
      }

      this.programs[fileName] = glProgram;

      function _initShader(shaderProgram) {
        gl.useProgram(shaderProgram);
    
        // Configure shader attributes
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
        if (shaderProgram.vertexPositionAttribute !== -1) {
          gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        }

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aUv");
        if (shaderProgram.textureCoordAttribute !== -1) {
          gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        }
    
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
        if (shaderProgram.vertexNormalAttribute !== -1) {
          gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        }
        
    
        // Configure uniforms
        shaderProgram.modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
        shaderProgram.normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");
        shaderProgram.posicionSolUniform = gl.getUniformLocation(shaderProgram, "posicionSol");
        shaderProgram.posicionCamaraMundoUniform = gl.getUniformLocation(shaderProgram, "posicionCamaraMundo");

        // Iluminacion
        shaderProgram.colorAmbienteUniform = gl.getUniformLocation(shaderProgram, "colorAmbiente");
        shaderProgram.colorDifusoUniform = gl.getUniformLocation(shaderProgram, "colorDifuso");
        shaderProgram.colorEspecularUniform = gl.getUniformLocation(shaderProgram, "colorEspecular");
        shaderProgram.glossinessUniform = gl.getUniformLocation(shaderProgram, "glossiness");
      }

      _initShader(glProgram);
    });
  }

  program = (fileName) => {
    if (this.programs.hasOwnProperty(fileName)) {
      return this.programs[fileName];
    } else {
      const msg = `Unexisting shader program "${fileName}"`;
      console.error(msg)
      throw new Error(msg);
    }
  }

  updateShadersViewMatrix = (viewMatrix) => {
    for (let [_shaderName, program] of Object.entries(this.programs)) {
      gl.useProgram(program);
      const viewMatrixUniform = gl.getUniformLocation(program, "viewMatrix");
      gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
      gl.unifo
    }
  }

  updatePosicionSol = (posicionSol) => {
    for (let [_shaderName, program] of Object.entries(this.programs)) {
      gl.useProgram(program);
      gl.uniform3fv(program.posicionSolUniform, posicionSol);
    }
  }

  updatePosicionLuz = (posicion, shaderVarName) => {
    for (let [_shaderName, program] of Object.entries(this.programs)) {
      gl.useProgram(program);
      const location = gl.getUniformLocation(program, shaderVarName);

      if (location) {
        gl.uniform3fv(location, posicion);
      }
    }
  }

  updatePosicionCamaraMundo = (posicionCamara) => {
    for (let [_shaderName, program] of Object.entries(this.programs)) {
      gl.useProgram(program);
      gl.uniform3fv(program.posicionCamaraMundoUniform, posicionCamara);
    }
  }

  updateShadersProjectionMatrix = (projectionMatrix) => {
    for (let [_shaderName, program] of Object.entries(this.programs)) {
      gl.useProgram(program);
      const projMatrixUniform = gl.getUniformLocation(program, "projMatrix");
      gl.uniformMatrix4fv(projMatrixUniform, false, projectionMatrix);
    }
  }
}

export default ShadersManager;