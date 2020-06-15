import DefaultMaterial from "./types/default_material.js";
import MaderaClara from "./types/madera_clara.js";
import MaderaOscura from "./types/madera_oscura.js";
import Hilo from "./types/hilo.js";
import Piedra from "./types/piedra.js";

window.webGLApp = {
  ...window.webGLApp,
  DefaultMaterial: DefaultMaterial,
  MaderaClara: MaderaClara,
  MaderaOscura: MaderaOscura,
  Hilo: Hilo,
  Piedra: Piedra,
}