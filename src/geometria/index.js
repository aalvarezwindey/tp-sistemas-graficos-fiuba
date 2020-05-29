import Objeto3D from "./objeto_3d.js";
import Sphere from "./superficies_parametricas/superficies/sphere.js";

window.webGLApp = {
  ...window.webGLApp,
  Objeto3D: Objeto3D,
  Sphere: Sphere,
}