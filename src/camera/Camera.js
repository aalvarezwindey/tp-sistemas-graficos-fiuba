class Camera {
  constructor(initialMatrix) {
    this.viewMatrix = initialMatrix;
    this.offsetMove = 0.5;

    document.addEventListener('keypress', (event) => {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 68: // D
        case 100: // d
          mat4.translate(this.viewMatrix, this.viewMatrix, [-this.offsetMove, 0, 0]);
          break;

        case 83: // S
        case 115: // s
          mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -this.offsetMove]);
          break;

        case 65: // A
        case 97: // a
          mat4.translate(this.viewMatrix, this.viewMatrix, [this.offsetMove, 0, 0]);
          break;

        case 87: // W
        case 119: // w
          mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, this.offsetMove]);
          break;

        default:
          // Do nothing
      }
    })
  }

  getViewMatrix = () => {
    return this.viewMatrix;
  }
}

export default Camera;