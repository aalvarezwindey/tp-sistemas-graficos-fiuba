const {
  crearGeometria,
  dibujarGeometria,
  ShadersManager,
} = window.webGLApp;

console.log('window.webGLApp', window.webGLApp)

var mat4 = glMatrix.mat4;
var vec3 = glMatrix.vec3;

var gl = null,
  canvas = null;

var vertexPositionAttribute = null,
  trianglesVerticeBuffer = null,
  vertexNormalAttribute = null,
  trianglesNormalBuffer = null,
  trianglesIndexBuffer = null;

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;
var malla = null;
var shaderProgram = null;

function setupWebGL() {
  gl.enable(gl.DEPTH_TEST);
  //set the clear color
  gl.clearColor(1, 1, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Matrix de Proyeccion Perspectiva

  mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

  mat4.identity(modelMatrix);
  mat4.rotate(modelMatrix, modelMatrix, -1.57078, [1.0, 0.0, 0.0]);

  mat4.identity(viewMatrix);
  mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -10.0]);
}

function setupVertexShaderMatrix() {
  var modelMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
  var viewMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");
  var projMatrixUniform = gl.getUniformLocation(shaderProgram, "projMatrix");
  var normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");

  gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
  gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
  gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function drawScene() {
  setupVertexShaderMatrix();

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
  gl.enableVertexAttribArray(vertexNormalAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
  gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

  dibujarGeometria(malla, shaderProgram);
}


function animate() {
  rotate_angle += 0.01;
  mat4.identity(modelMatrix);
  mat4.rotate(modelMatrix, modelMatrix, rotate_angle, [1.0, 0.0, 0.0]);

  mat4.identity(normalMatrix);
  mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
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
      malla = crearGeometria();
      setupVertexShaderMatrix();
      tick();
    });

  } else {
    alert("Error: Your browser does not appear to support WebGL.");
  }
}

window.onload = startWebGLApp;
