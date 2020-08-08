precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vPosicionSol;
varying vec3 vPosicionCamaraMundo;

varying vec3 vColorAmbiente;
varying vec3 vColorDifuso;
varying vec3 vColorEspecular; // ks
varying float vGlossiness;

varying vec2 vUv;

void main(void) {
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    vec3 camVec = normalize(vPosicionCamaraMundo - vPosWorld);

    vec3 componenteDifusa = dot(lightVec, vNormal) * vColorDifuso;

    vec3 reflexVec = normalize(reflect(-lightVec, vNormal));
    vec3 componenteEspecular = pow(max(0.0, dot(reflexVec, camVec)), vGlossiness) * vColorEspecular;

    vec3 color = componenteDifusa + vColorAmbiente + componenteEspecular;

    vec3 colorLuzSol = vec3(1.0, 1.0, 1.0);
    float factorAtenuacionDeIntensidadDeLaLuz = 1.0;
    vec3 intensidadLuzSol = colorLuzSol * factorAtenuacionDeIntensidadDeLaLuz;

    gl_FragColor = vec4(color * intensidadLuzSol, 1.0);
}