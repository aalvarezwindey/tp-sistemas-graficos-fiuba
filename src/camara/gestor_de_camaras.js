import CamaraPrimeraPersona from "./camara_primera_persona.js";
import CamaraOrbital from "./camara_orbital.js";

class GestorDeCamaras {
  constructor() {
    this.camaraPrimeraPersona = new CamaraPrimeraPersona();
    this.camaraOrbital = new CamaraOrbital();

    this.camara = this.camaraOrbital;
    this.camarasDisponibles = [
      this.camaraPrimeraPersona,
      this.camaraOrbital
    ]
  }

  getCamara = () => this.camara

  proximaCamara = () => {
    let camaraIndex = this.camarasDisponibles.indexOf(this.camara);

    if (camaraIndex === this.camarasDisponibles.length - 1) {
      camaraIndex = 0;
    } else {
      camaraIndex++;
    }

    this.camara = this.camarasDisponibles[camaraIndex];
  }

  cambiarObjetivo = (objeto3D) => {
    this.camaraOrbital.cambiarObjetivo(objeto3D.position)
  }
}

export default GestorDeCamaras;