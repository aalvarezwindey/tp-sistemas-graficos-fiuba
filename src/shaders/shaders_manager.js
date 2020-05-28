const DEFAULT = 'default';

const SHADERS_FILE_NAMES = [
  DEFAULT,
];

class ShadersManager {
  // Shaders IDs getters
  static get DEFAULT() { return DEFAULT }

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
}

export default ShadersManager;