const {
  Objeto3D,
  Sphere,
  Plano,
  ShadersManager,
  GestorDeCamaras,
  DefaultMaterial, MaderaClara, MaderaOscura, Hilo, Piedra, Rojo, Verde, Azul, Beige, LozaAzul, Cesped, Agua, PruebaNormales, Luz, Vidrio,
  Escena
} = window.webGLApp;

var mat4 = glMatrix.mat4;
var mat3 = glMatrix.mat3;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var DAT_GUI = dat;

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
var MATERIAL_PIEDRA = null;
var MATERIAL_ROJO = null;
var MATERIAL_VERDE = null;
var MATERIAL_AZUL = null;
var MATERIAL_BEIGE = null;
var MATERIAL_LOZA_AZUL = null;
var MATERIAL_AGUA = null;
var MATERIAL_CESPED = null;
var MATERIAL_PRUEBA_NORMALES = null;
var MATERIAL_LUZ = null;
var MATERIAL_VIDRIO = null;

var VELOCIDAD_ANIMACION = 1;
var PAUSA = false;
var TIEMPO = 0;
var DEBUG_EJES = false;
var EJES_DE_COORDENADAS = null;

var PROYECTIL_CATAPULTA = null;
var PROYECTIL_DESPRENDIDO = false;
var POSICION_MUNDO_PROYECTIL_ANTES_DE_DESPRENDERSE = null;
var FRONTAL_CATAPULTA_AL_DISPARAR = null;
var TIEMPO_INICIAL_DESPRENDIMIENTO = null;
var GUI_MATERIALES = null;

function setupWebGL() {
  // Matrix de Proyeccion Perspectiva
  mat4.perspective(projMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

  gestorDeCamaras = new GestorDeCamaras();
}

function drawScene() {
  gl.canvas.width  = window.innerWidth;
  gl.canvas.height = window.innerHeight;

  //set the clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Actualizamos matriz de perspectiva
  mat4.perspective(projMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  escena.updateProjectionMatrix(projMatrix);

  // Actualizamos matriz de vista
  escena.updateViewMatrix();

  const rootMatrix = mat4.create();
  escena.render(rootMatrix);
}

function tick() {
  requestAnimationFrame(tick);
  if (!PAUSA) {
    TIEMPO += 0.1 * VELOCIDAD_ANIMACION * 1/60;
  }
  drawScene();
}

function startWebGLApp() {
  canvas = document.getElementById("my-canvas");

  try {
    gl = canvas.getContext("webgl");

  } catch (e) {
    alert("Error: Your browser does not appear to support WebGL.");
  }

  if (gl) {
    const clearColor = [25/255, 121/255, 169/255, 1.0];
    console.log("startWebGLApp -> clearColor", clearColor)
    gl.clearColor(...clearColor);
    gl.enable(gl.DEPTH_TEST);

    setupWebGL(); // configurar web GL
    ShadersManager.init(gl).then(shaders => {
      shadersManager = shaders;
      DEFAULT_MATERIAL = new DefaultMaterial(shadersManager)
      MATERIAL_MADERA_CLARA = new MaderaClara(shadersManager);
      MATERIAL_MADERA_OSCURA = new MaderaOscura(shadersManager);
      MATERIAL_HILO = new Hilo(shadersManager);
      MATERIAL_PIEDRA = new Piedra(shadersManager);
      MATERIAL_ROJO = new Rojo(shadersManager);
      MATERIAL_VERDE = new Verde(shadersManager);
      MATERIAL_AZUL = new Azul(shadersManager);
      MATERIAL_BEIGE = new Beige(shadersManager);
      MATERIAL_LOZA_AZUL = new LozaAzul(shadersManager);
      MATERIAL_CESPED = new Cesped(shadersManager);
      MATERIAL_AGUA = new Agua(shadersManager);
      MATERIAL_LUZ = new Luz(shadersManager);
      MATERIAL_PRUEBA_NORMALES = new PruebaNormales(shadersManager);
      MATERIAL_VIDRIO = new Vidrio(shadersManager);

      escena = new Escena(shaders, gestorDeCamaras);
      escena.updateProjectionMatrix(projMatrix);

      

      tick();
    });

  } else {
    alert("Error: Your browser does not appear to support WebGL.");
  }
}

window.onload = startWebGLApp;
