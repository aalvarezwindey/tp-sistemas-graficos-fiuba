import CamaraPrimeraPersona from "./camara_primera_persona.js";
import CamaraOrbital from "./camara_orbital.js";
import GestorDeCamaras from "./gestor_de_camaras.js";

window.webGLApp = {
  ...window.webGLApp,
  CamaraPrimeraPersona: CamaraPrimeraPersona,
  CamaraOrbital: CamaraOrbital,
  GestorDeCamaras: GestorDeCamaras,
}