import CamaraPrimeraPersona from "./camara_primera_persona.js";
import CamaraOrbital from "./camara_orbital.js";
import CamaraTerceraPersona from "./camara_tercera_persona.js";

class GestorDeCamaras {
  constructor(persona) {
    this.camaraPrimeraPersona = new CamaraPrimeraPersona();
    this.camaraOrbital = new CamaraOrbital();
    this.camaraTerceraPersona = new CamaraTerceraPersona(persona);

    this.camara = this.camaraOrbital;
    this.camarasDisponibles = [
      this.camaraPrimeraPersona,
      this.camaraOrbital,
      this.camaraTerceraPersona
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

  setPersonaParaCamaraTerceraPersona = (persona) => {
    this.camaraTerceraPersona.setPersona(persona);
  }
}

export default GestorDeCamaras;