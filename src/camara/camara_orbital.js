const DEFAULT_PARAMS = {
  objetivo: [0, 0, 0],
  posicion: [0, 0, 0],
}

class CamaraOrbital {
  constructor(params = DEFAULT_PARAMS) {
    const { objetivo, posicion } = params;
    this.posicion = posicion;
    this.objetivo = objetivo;

    this.isMouseDown = false;
    this.mouse = { x: 0, y: 0 };
    this.clientXAnterior = 0;
    this.clientYAnterior = 0;
    this.factorVelocidad = 0.01;

    this.radio = 0;
    this.deltaRadio = 0.4;
    this.alfa = 0;
    this.beta = Math.PI / 2;

    document.addEventListener('mousemove', event => {
      this.mouse.x = event.clientX || event.pageX;
      this.mouse.y = event.clientY || event.pageY;

      if (this.isMouseDown) {
        this._actualizarAlfaYBeta();
        this._actualizarPosicionDeCamara()
      }
    });

    document.addEventListener('mousedown', event => {
      console.log('mousedonw')
      this.isMouseDown = true;
    })

    document.addEventListener('mouseup', event => {
      this.isMouseDown = false;
    });

    document.addEventListener('wheel', event => {
      if (event.deltaY > 0) {
        // Scrolling up
        this.radio += this.deltaRadio;
      }

      if (event.deltaY < 0) {
        // Scrolling down
        this.radio -= this.deltaRadio;
        if (this.radio < 0) this.radio = 0;
      }

      this._actualizarPosicionDeCamara();
    })
  }

  getMatrizDeVista = () => {
    const matrizDeVista = mat4.create();
    mat4.lookAt(matrizDeVista, this.posicion, this.objetivo, [0, 1, 0]);
    return matrizDeVista;
  }

  _actualizarAlfaYBeta = () => {
    let deltaX = 0;
    let deltaY = 0;


    if (this.clientXAnterior) deltaX = this.mouse.x - this.clientXAnterior;
    if (this.clientYAnterior) deltaY = this.mouse.y - this.clientYAnterior;

    this.clientXAnterior = this.mouse.x;
    this.clientYAnterior = this.mouse.y;

    this.alfa = this.alfa + deltaX * this.factorVelocidad;
    this.beta = this.beta + deltaY * this.factorVelocidad;

    if (this.beta < 0) this.beta = 0 + 0.05;
    if (this.beta > Math.PI) this.beta = Math.PI - 0.05;
  }

  _actualizarPosicionDeCamara = () => {
    this.posicion = vec3.fromValues(
      this.radio * Math.sin(this.alfa) * Math.sin(this.beta),
      this.radio * Math.cos(this.beta),
      this.radio * Math.cos(this.alfa) * Math.sin(this.beta),
    );
  }
}

export default CamaraOrbital;