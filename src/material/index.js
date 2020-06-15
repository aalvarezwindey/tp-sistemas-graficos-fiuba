import DefaultMaterial from "./types/default_material.js";
import MaderaClara from "./types/madera_clara.js";
import MaderaOscura from "./types/madera_oscura.js";
import Hilo from "./types/hilo.js";

window.webGLApp = {
  ...window.webGLApp,
  DefaultMaterial: DefaultMaterial,
  MaderaClara: MaderaClara,
  MaderaOscura: MaderaOscura,
  Hilo: Hilo,
}