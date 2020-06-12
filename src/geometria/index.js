import Objeto3D from "./objeto_3d.js";
import Sphere from "./superficies_parametricas/superficies/sphere.js";
import Plano from "./superficies_parametricas/superficies/plano.js";
import SuperficieParametrica from "./superficies_parametricas/superficie_parametrica.js";
import SuperficieBarrido from "./superficie_barrido/superficie_barrido.js";
import RecorridoParametrico from "./superficie_barrido/recorrido_parametrico.js";
import Poligono from "./superficie_barrido/poligono.js";
import Circulo from "./superficie_barrido/poligonos/circulo.js";
import Rectangulo from "./superficie_barrido/poligonos/rectangulo.js";
import Circunferencia from "./superficie_barrido/recorridos_parametricos/circunferencia.js";
import Recta from "./superficie_barrido/recorridos_parametricos/recta.js";

window.webGLApp = {
  ...window.webGLApp,
  Objeto3D: Objeto3D,
  Sphere: Sphere,
  Plano: Plano,
  SuperficieParametrica: SuperficieParametrica,
  SuperficieBarrido: SuperficieBarrido,
  RecorridoParametrico: RecorridoParametrico,
  Poligono: Poligono,
  Circulo: Circulo,
  Rectangulo: Rectangulo,
  Circunferencia: Circunferencia,
  Recta: Recta,
}