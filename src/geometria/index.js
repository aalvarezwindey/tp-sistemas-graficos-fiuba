import { crearGeometria, dibujarGeometria } from "./geometria.js";

window.webGLApp = {
  ...window.webGLApp,
  crearGeometria: crearGeometria,
  dibujarGeometria: dibujarGeometria
}