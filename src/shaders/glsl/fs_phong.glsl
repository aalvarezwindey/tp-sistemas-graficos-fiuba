precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vPosicionSol;

varying vec3 vColorAmbiente;
varying vec3 vColorDifuso;

varying vec2 vUv;

void main(void) {
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    // vec3 diffColor = mix(vec3(0.7, 0.7, 0.7), vNormal, 0.4);
    vec3 color = dot(lightVec, vNormal) * vColorDifuso + vColorAmbiente;

    vec3 colorLuzSol = vec3(1.0, 1.0, 1.0);
    float factorAtenuacionDeIntensidadDeLaLuz = 1.0 / distance(vPosicionSol, vPosWorld);
    vec3 intensidadLuzSol = colorLuzSol * factorAtenuacionDeIntensidadDeLaLuz;

    gl_FragColor = vec4(color * intensidadLuzSol, 1.0);
}