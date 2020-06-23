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
  AGUA
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

  static async init(glContext, baseUrl = 'src/shaders/glsl') {
    const results = await Promise.all(SHADERS_FILE_NAMES.map(fileName => {
      return new Promise((resolve, reject) => {
        Promise.all([
          fetch(`${baseUrl}/fs_${fileName}.glsl`),
          fetch(`${baseUrl}/vs_${fileName}.glsl`)
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