precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;

varying vec3 vPosicionSol;
varying vec3 vPosicionProyectil;

varying vec3 vPosicionCamaraMundo;

varying vec3 vColorAmbiente;
varying vec3 vColorDifuso;
varying vec3 vColorEspecular; // ks
varying float vGlossiness;

varying vec2 vUv;

void main(void) {
    vec3 camVec = normalize(vPosicionCamaraMundo - vPosWorld);

    // Sol
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    vec3 componenteDifusa = dot(lightVec, vNormal) * vColorDifuso;

    vec3 reflexVec = normalize(reflect(-lightVec, vNormal));
    vec3 componenteEspecular = pow(max(0.0, dot(reflexVec, camVec)), vGlossiness) * vColorEspecular;

    vec3 color = componenteDifusa + vColorAmbiente + componenteEspecular;

    vec3 colorLuzSol = vec3(1.0, 1.0, 1.0);
    float factorAtenuacionDeIntensidadDeLaLuz = 1.0;
    vec3 intensidadLuzSol = colorLuzSol * factorAtenuacionDeIntensidadDeLaLuz;

    // Proyectil
    vec3 lightVecProyectil = normalize(vPosicionProyectil - vPosWorld);
    vec3 componenteDifusaProyectil = dot(lightVecProyectil, vNormal) * vColorDifuso;
    vec3 reflexVecProyectil = normalize(reflect(-lightVecProyectil, vNormal));
    vec3 componenteEspecularProyectil = pow(max(0.0, dot(reflexVecProyectil, camVec)), vGlossiness) * vColorEspecular;

    vec3 colorProyectil = componenteDifusaProyectil + vColorAmbiente + componenteEspecularProyectil;

    vec3 colorLuzProyectil = vec3(0.01, 0.01, 0.01);
    float factorAtenuacionProyectil = 1.0 / pow(distance(vPosicionProyectil, vPosWorld), 1.0);
    vec3 intensidadLuzProyectil = colorLuzProyectil * factorAtenuacionProyectil;

    vec3 colorFinal = (color * intensidadLuzSol) + (colorProyectil + intensidadLuzProyectil);

    gl_FragColor = vec4(colorFinal, 1.0);
}