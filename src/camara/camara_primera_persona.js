import Objeto3D from "../geometria/objeto_3d.js";

const D_OBJ = 5;
const OFFSET_ROTACION = 0.1;

class CamaraPrimeraPersona {
  constructor() {
    const POSICION_DEFAULT = new Objeto3D();
    POSICION_DEFAULT.setPosition(0, 0, 0);
    const OBJETIVO_DEFAULT = new Objeto3D();
    OBJETIVO_DEFAULT.setPosition(0, 0, -D_OBJ);

    this.posicion = POSICION_DEFAULT;
    this.objetivo = OBJETIVO_DEFAULT;
    this.offsetMove = 0.5;
    this.offsetRotation = 0.2;

    this.mouse = { x: 0, y: 0 };
    this.clientXAnterior = 0;
    this.clientYAnterior = 0;
    this.factorVelocidad = 0.01;

    this.alfa = 0;
    this.beta = Math.PI / 2;

    this.frontal = [0, 0, 1];
    this.lateral = [1, 0, 0];
    this.rotacion = 0;

    document.addEventListener('mousemove', event => {
      this.mouse.x = event.clientX || event.pageX;
      this.mouse.y = event.clientY || event.pageY;

      this._actualizarAlfaYBeta();
      this._actualizarPosicionDelObjetivo();
    });

    document.addEventListener('keydown', event => {
      switch(event.key){
        case "a":
          this.posicion.setPosition(
            this.posicion.position[0] + this.lateral[0],
            0,
            this.posicion.position[2] + this.lateral[2],
          )
          break;

        case "d":
          this.posicion.setPosition(
            this.posicion.position[0] - this.lateral[0],
            0,
            this.posicion.position[2] - this.lateral[2],
          )
          break;

        case "w":
          this.posicion.setPosition(
            this.posicion.position[0] + this.frontal[0],
            0,
            this.posicion.position[2] + this.frontal[2],
          )
          break;

        case "s":
          this.posicion.setPosition(
            this.posicion.position[0] - this.frontal[0],
            0,
            this.posicion.position[2] - this.frontal[2],
          )
          break;

        case "q":
          this.rotacion += OFFSET_ROTACION;
          this._actualizarFrontalYLateral();
          break;

        case "e":
          this.rotacion -= OFFSET_ROTACION;
          this._actualizarFrontalYLateral();
          break;
    }
    })
  }

  getMatrizDeVista = () => {
    const matrizDeModeladoDelPersonaje = this.posicion.modelMatrix;
    const matrizDeModeladoDelObjetivo = this.objetivo.modelMatrix;

    const posicionPersonajeEnMundo = vec3.create();
    vec3.transformMat4(posicionPersonajeEnMundo, vec3.fromValues(0, 0, 0), matrizDeModeladoDelPersonaje);

    // Calculamos la matriz del objetivo de manera relativa al personaje
    const aux = mat4.create();
    mat4.multiply(aux, matrizDeModeladoDelPersonaje, matrizDeModeladoDelObjetivo);
    const posicionObjetivoEnMundo = vec3.create();
    vec3.transformMat4(posicionObjetivoEnMundo, vec3.fromValues(0, 0, 0), aux);

    const matrizDeVista = mat4.create();
    mat4.lookAt(matrizDeVista, posicionPersonajeEnMundo, posicionObjetivoEnMundo, [0, 1, 0]);
    return matrizDeVista;
  }

  _actualizarAlfaYBeta = () => {
    let deltaX = 0;
    let deltaY = 0;

    if (this.clientXAnterior) deltaX = - (this.mouse.x - this.clientXAnterior);
    if (this.clientYAnterior) deltaY = this.mouse.y - this.clientYAnterior;

    this.clientXAnterior = this.mouse.x;
    this.clientYAnterior = this.mouse.y;

    this.alfa = this.alfa + deltaX * this.factorVelocidad;
    this.beta = this.beta + deltaY * this.factorVelocidad;

    if (this.beta < 0) this.beta = 0;
    if (this.beta > Math.PI) this.beta = Math.PI;
  }

  _actualizarFrontalYLateral = () => {
    this.frontal = vec3.fromValues(0, 0, 1);
    this.lateral = vec3.fromValues(1, 0, 0);

    const m = mat4.create();
    mat4.fromYRotation(m, this.rotacion);
    vec3.transformMat4(this.frontal, this.frontal, m);
    vec3.transformMat4(this.lateral, this.lateral, m);

    this.posicion.setRotation(0, this.rotacion, 0);
  }

  _actualizarPosicionDelObjetivo = () => {
    this.objetivo.setPosition(
      D_OBJ * Math.sin(this.alfa) * Math.sin(this.beta),
      D_OBJ * Math.cos(this.beta),
      D_OBJ * Math.cos(this.alfa) * Math.sin(this.beta)
    );
  }
}

export default CamaraPrimeraPersona;