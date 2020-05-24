function _makeShader(gl, code, type) {

  var shader;

  if (type == "fragment")
      shader = gl.createShader(gl.FRAGMENT_SHADER);
  else // "vertex"
      shader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
  }
  return shader;
}

function initShaders({ gl, fsSrc, vsSrc }) {
  //compile shaders
  var fragmentShader = _makeShader(gl, vsSrc, "vertex");
  var vertexShader = _makeShader(gl, fsSrc, "fragment");

  //create program
  glProgram = gl.createProgram();

  //attach and link shaders to the program
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);

  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }

  //use program
  gl.useProgram(glProgram);
}

function _loadFS() {
  return $.ajax({
    url: "src/shaders/fragment-shader.glsl",
  });
}

function _loadVS() {
  return $.ajax({
    url: "src/shaders/vertex-shader.glsl",
  });
}

function fetchShadersFiles(callback) {
  $.when(_loadVS(), _loadFS()).done(function (vsResult, fsResult) {
    callback(fsResult[0], vsResult[0]);
  });
}