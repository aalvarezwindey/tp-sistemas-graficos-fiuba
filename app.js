const {
  Objeto3D,
  Sphere,
  Plano,
  ShadersManager,
  GestorDeCamaras,
  DefaultMaterial,
  MaderaClara,
  MaderaOscura,
  Hilo,
  Escena
} = window.webGLApp;

console.log('window.webGLApp', window.webGLApp)

var mat4 = glMatrix.mat4;
var mat3 = glMatrix.mat3;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;

var gl = null;
var canvas = null;
var projMatrix = mat4.create();
var escena = null;
var gestorDeCamaras = null;
var shadersManager = null;
var DEFAULT_MATERIAL = null;
var MATERIAL_MADERA_CLARA = null;
var MATERIAL_MADERA_OSCURA = null;
var MATERIAL_HILO = null;

function setupWebGL() {
  //set the clear color
  gl.clearColor(0.7, .7, .7, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  gl.enable(gl.DEPTH_TEST);

  // Matrix de Proyeccion Perspectiva
  mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

  gestorDeCamaras = new GestorDeCamaras();
}

function drawScene() {
  gl.canvas.width  = window.innerWidth;
  gl.canvas.height = window.innerHeight;

  // Actualizamos matriz de perspectiva
  mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  escena.updateProjectionMatrix(projMatrix);

  // Actualizamos matriz de vista
  escena.updateViewMatrix();

  const rootMatrix = mat4.create();
  escena.render(rootMatrix);
}


/* function animate() {
  mat4.identity(modelMatrix);

  mat4.identity(normalMatrix);
  mat4.multiply(normalMatrix, camera.getViewMatrix(), modelMatrix);
  mat4.invert(normalMatrix, normalMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
}
 */
function tick() {
  requestAnimationFrame(tick);
  drawScene();
  //animate();
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
      shadersManager = shaders;
      DEFAULT_MATERIAL = new DefaultMaterial(shadersManager)
      MATERIAL_MADERA_CLARA = new MaderaClara(shadersManager);
      MATERIAL_MADERA_OSCURA = new MaderaOscura(shadersManager);
      MATERIAL_HILO = new Hilo(shadersManager);
      escena = new Escena(shaders, gestorDeCamaras);
      escena.updateProjectionMatrix(projMatrix);
      tick();
    });

  } else {
    alert("Error: Your browser does not appear to support WebGL.");
  }
}

window.onload = startWebGLApp;
