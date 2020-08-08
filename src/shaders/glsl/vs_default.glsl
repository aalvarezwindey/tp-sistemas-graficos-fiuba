precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;

uniform vec3 posicionSol;
varying vec3 vPosicionSol;

uniform vec3 colorAmbiente;
varying vec3 vColorAmbiente;

uniform vec3 posicionCamaraMundo;
varying vec3 vPosicionCamaraMundo;

uniform vec3 colorDifuso;
varying vec3 vColorDifuso;

uniform vec3 colorEspecular;
varying vec3 vColorEspecular;

uniform float glossiness;
varying float vGlossiness;

varying vec3 vNormal;
varying vec3 vPosWorld;

varying vec2 vUv;

void main(void) {
    vec2 uv = aUv;

    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);

    vPosWorld = (modelMatrix * vec4(aPosition, 1.0)).xyz;    //la posicion en coordenadas de mundo
    vNormal = normalize((normalMatrix * vec4(aNormal, 1.0)).xyz);       //la normal en coordenadas de mundo
    vUv = uv;
    vPosicionSol = posicionSol;
    vColorAmbiente = colorAmbiente;
    vColorDifuso = colorDifuso;
    vPosicionCamaraMundo = posicionCamaraMundo;
    vColorEspecular = colorEspecular;
    vGlossiness = glossiness;
}