class Camera {
  constructor(initialMatrix) {
    this.viewMatrix = initialMatrix;
    this.offsetMove = 0.5;
    this.offsetRotation = 0.2;

    // WASD listeners
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
    });

    // Arrow listeners
    // TODO: Fix this
    document.addEventListener('keydown', event => {
      const keyCode = event.keyCode;
      console.log('keyCode', keyCode)
      switch (keyCode) {
        case 37: // <-
          mat4.rotate(this.viewMatrix, this.viewMatrix, this.offsetRotation, [0, 1, 0]);
          break;

        case 38: // Up arrow
          mat4.rotate(this.viewMatrix, this.viewMatrix, this.offsetRotation, [1, 0, 0]);
          break;

        case 39: // ->
          mat4.rotate(this.viewMatrix, this.viewMatrix, this.offsetRotation, [0, -1, 0]);
          break;

        case 40: // Down arrow
          mat4.rotate(this.viewMatrix, this.viewMatrix, this.offsetRotation, [-1, 0, 0]);
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