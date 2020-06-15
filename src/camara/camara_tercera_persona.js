class CamaraTerceraPersona {
  constructor(persona) {
    this.persona = persona;
    this.OFFSET_ALTURA = 3;
    this.FACTOR_ALTURA_DEFAULT = 2;
    this.OFFSET_DISTANCIA = 1;
    this.MIN_DISTANCIA_A_PERSONA = 10;
    this.MAX_DISTANCIA_A_PERSONA = 45;
    this.distanciaAPersona = 30;

    document.addEventListener('wheel', event => {
      if (event.deltaY > 0) {
        // Scrolling up
        this.distanciaAPersona = Math.min(this.MAX_DISTANCIA_A_PERSONA, this.distanciaAPersona + this.OFFSET_DISTANCIA)
      }

      if (event.deltaY < 0) {
        // Scrolling down
        this.distanciaAPersona = Math.max(this.MIN_DISTANCIA_A_PERSONA, this.distanciaAPersona - this.OFFSET_DISTANCIA)
      }
    })
  }

  setPersona = p => this.persona = p;

  getMatrizDeVista = () => {
    const matrizDeVista = mat4.create();
    const alturaCamara = this.persona.altura ? this.persona.altura + this.OFFSET_ALTURA : this.OFFSET_ALTURA * this.FACTOR_ALTURA_DEFAULT;
    const posicionCamara = vec3.fromValues(
      this.persona.position[0] + this.persona.frontal[0] * this.distanciaAPersona,
      this.persona.position[1] + alturaCamara,
      this.persona.position[2] + this.persona.frontal[2] * this.distanciaAPersona,
    )
    mat4.lookAt(matrizDeVista, posicionCamara, this.persona.position, [0, 1, 0]);
    return matrizDeVista;
  }
}

export default CamaraTerceraPersona;