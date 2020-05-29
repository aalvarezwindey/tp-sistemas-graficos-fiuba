const {
  Objeto3D,
  Sphere,
  ShadersManager,
  Camera,
  crearGeometria,
  dibujarMalla
} = window.webGLApp;

console.log('window.webGLApp', window.webGLApp)

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

var gl = null,
  canvas = null;

var modelMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var esfera = null;
var shaderProgram = null;
var camera = null;

function setupWebGL() {
  gl.enable(gl.DEPTH_TEST);
  //set the clear color
  gl.clearColor(0.7, .7, .7, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Matrix de Proyeccion Perspectiva
  mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
  mat4.identity(modelMatrix);

  camera = new Camera(mat4.create());
}

function setupVertexShaderMatrix() {
  var modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
  var viewMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");
  var projMatrixUniform = gl.getUniformLocation(shaderProgram, "projMatrix");
  var normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");

  gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatrixUniform, false, camera.getViewMatrix());
  gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
  gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function drawScene() {
  gl.canvas.width  = window.innerWidth;
  gl.canvas.height = window.innerHeight;
  setupVertexShaderMatrix();
  esfera.render(camera.getViewMatrix());
}


function animate() {
  mat4.identity(modelMatrix);

  mat4.identity(normalMatrix);
  mat4.multiply(normalMatrix, camera.getViewMatrix(), modelMatrix);
  mat4.invert(normalMatrix, normalMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
}

function tick() {
  requestAnimationFrame(tick);
  drawScene();
  animate();
}

function startWebGLApp() {
  canvas = document.getElementById("my-canvas");

  try {
    gl = canvas.getContext("webgl");

  } catch (e) {
    alert("Error: Your browser does not appear to support WebGL.");
  }

  if (gl) {
    setupWebGL(); // configurar web GL
    ShadersManager.init(gl).then(shaders => {
      shaderProgram = shaders.program(ShadersManager.DEFAULT);
      gl.useProgram(shaderProgram);


      shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

      shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aUv");
      gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

      shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
      gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
      esfera = new Objeto3D({
        surface: new Sphere(1),
        shaderProgram: shaderProgram,
        glContext: gl
      });
      setupVertexShaderMatrix();
      tick();
    });

  } else {
    alert("Error: Your browser does not appear to support WebGL.");
  }
}

window.onload = startWebGLApp;
