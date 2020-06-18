import DefaultMaterial from "./types/default_material.js";
import MaderaClara from "./types/madera_clara.js";
import MaderaOscura from "./types/madera_oscura.js";
import Hilo from "./types/hilo.js";
import Piedra from "./types/piedra.js";
import Rojo from "./types/rojo.js";
import Verde from "./types/verde.js";
import Azul from "./types/azul.js";
import Beige from "./types/beige.js";

window.webGLApp = {
  ...window.webGLApp,
  DefaultMaterial: DefaultMaterial,
  MaderaClara: MaderaClara,
  MaderaOscura: MaderaOscura,
  Hilo: Hilo,
  Piedra: Piedra,
  Rojo: Rojo,
  Verde: Verde,
  Azul: Azul,
  Beige: Beige,
}