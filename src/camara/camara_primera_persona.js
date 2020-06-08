const DEFAULT_PARAMS = {
  objetivo: [0, 0, 0],
  posicion: [0, 0, 0],
}

class CamaraPrimeraPersona {
  constructor(params = DEFAULT_PARAMS) {
    const { objetivo, posicion } = params;
    this.posicion = posicion;
    this.objetivo = objetivo;
    this.offsetMove = 0.5;
    this.offsetRotation = 0.2;

    // WASD listeners
    document.addEventListener('keypress', (event) => {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 68: // D
        case 100: // d
          this.posicion = [
            this.posicion[0] - this.offsetMove,
            this.posicion[1],
            this.posicion[2]
          ]
          break;

        case 83: // S
        case 115: // s
          this.posicion = [
            this.posicion[0],
            this.posicion[1],
            this.posicion[2] - this.offsetMove
          ]
          break;

        case 65: // A
        case 97: // a
          this.posicion = [
            this.posicion[0] + this.offsetMove,
            this.posicion[1],
            this.posicion[2]
          ];
          break;

        case 87: // W
        case 119: // w
          this.posicion = [
            this.posicion[0],
            this.posicion[1],
            this.posicion[2] + this.offsetMove
          ];
          break;

        default:
          // Do nothing
      }
    });

    // Arrow listeners
    // TODO: Fix this
    document.addEventListener('keydown', event => {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 37: // <-
          
          break;

        case 38: // Up arrow
          
          break;

        case 39: // ->
          
          break;

        case 40: // Down arrow
          
          break;

        default:
          // Do nothing
      }
    })
  }

  getMatrizDeVista = () => {
    const matrizDeVista = mat4.create();
    mat4.lookAt(matrizDeVista, this.posicion, this.objetivo, [0, 1, 0]);
    return matrizDeVista;
  }
}

export default CamaraPrimeraPersona;