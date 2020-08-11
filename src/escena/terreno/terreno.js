import Objeto3D from "../../geometria/objeto_3d.js";
import SuperficieBarrido from "../../geometria/superficie_barrido/superficie_barrido.js";
import PerfilTerreno from "../../geometria/superficie_barrido/poligonos/perfil_terreno.js";
import Cilindro from "../../geometria/objetos_3d/cilindro.js";
import Circunferencia from "../../geometria/superficie_barrido/recorridos_parametricos/circunferencia.js";
import Prisma from "../../geometria/objetos_3d/prisma.js";

class Terreno extends Objeto3D {
  constructor() {
    super();

    this.terreno = new Objeto3D({
      geometry: new SuperficieBarrido(
        new PerfilTerreno(
          Terreno.PROFUNDIDAD_AGUA,
          Terreno.RADIO_AGUA,
          Terreno.LARGO_TERRENO,
          2,
        ),
        new Circunferencia(0.01, 10),
        false,
        100
      ),
      material: MATERIAL_CESPED,
      glContext: gl
    });

    this.agua = new Prisma(
      Terreno.PROFUNDIDAD_AGUA,
      Terreno.RADIO_AGUA * 2,
      Terreno.RADIO_AGUA * 2,
      MATERIAL_AGUA,
      null,
      10,
      10
    );
    this.agua.setRotation(-Math.PI / 2, 0, 0);
    this.agua.setPosition(0, 0, - (Terreno.DISTANCIA_AGUA_BORDE_TIERRA + Terreno.PROFUNDIDAD_AGUA / 2))
    this.terreno.setPosition(0, 0, -Terreno.PROFUNDIDAD_AGUA);

    this.isla = new Cilindro(Terreno.RADIO_ISLA, Terreno.PROFUNDIDAD_AGUA, MATERIAL_CESPED);
    this.isla.setRotation(0, Math.PI / 2, 0);
    this.isla.setPosition(0, 0, - Terreno.PROFUNDIDAD_AGUA / 2);

    this.puente = new Prisma(
      Terreno.LARGO_PUENTE, 
      Terreno.ANCHO_PUENTE, 
      Terreno.PROFUNDIDAD_AGUA, MATERIAL_CESPED
    );
    this.puente.setPosition(0, Terreno.RADIO_AGUA - Terreno.LARGO_PUENTE / 2, -0.5 * Terreno.PROFUNDIDAD_AGUA + Terreno.DISTANCIA_AGUA_BORDE_TIERRA);

    this.isla.addChild(this.puente);
    this.addChild(this.isla);
    this.addChild(this.agua);
    this.addChild(this.terreno);
  }
}

Terreno.PROFUNDIDAD_AGUA = 3

Terreno.MAX_LADO_CASTILLO = 20;
Terreno.RADIO_ISLA = Terreno.MAX_LADO_CASTILLO * 1.5;
Terreno.RADIO_AGUA = Terreno.RADIO_ISLA * 2;
Terreno.LARGO_TERRENO = 50;
Terreno.LARGO_PUENTE = Terreno.RADIO_AGUA - Terreno.RADIO_ISLA + 5;
Terreno.ANCHO_PUENTE = 8;

Terreno.DISTANCIA_AGUA_BORDE_TIERRA = 0.5;

export default Terreno;