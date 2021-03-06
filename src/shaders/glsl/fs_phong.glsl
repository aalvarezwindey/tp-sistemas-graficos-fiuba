precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;

varying vec3 vPosicionSol;
varying vec3 vPosicionProyectil;
varying vec3 vPosicionAntorcha1;
varying vec3 vPosicionAntorcha2;

varying vec3 vPosicionCamaraMundo;

varying vec3 vColorAmbiente;
varying vec3 vColorDifuso;
varying vec3 vColorEspecular; // ks
varying float vGlossiness;

varying vec2 vUv;
// The texture.
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;

void main(void) {
    vec3 camVec = normalize(vPosicionCamaraMundo - vPosWorld);
    vec4 colorTextura_1 = texture2D(u_texture1, vUv);
    vec3 colorTextura3D_1 = colorTextura_1.xyz;

    // Textura 2
    vec3 colorTextura3D_2_1 = texture2D(u_texture2, vUv).xyz;
    vec3 colorTextura3D_2_2 = texture2D(u_texture2, vUv * 2.17123).xyz;
    vec3 colorTextura3D_2_3 = texture2D(u_texture2, vUv * 3.8813).xyz;
    vec3 colorTextura3D_2 = mix(mix(colorTextura3D_2_1, colorTextura3D_2_2, 0.5), colorTextura3D_2_3, 0.3);

    // Textura 3
    vec3 colorTextura3D_3_1 = texture2D(u_texture3, vUv * 0.893).xyz;
    vec3 colorTextura3D_3_2 = texture2D(u_texture3, vUv * 2.17343).xyz;
    vec3 colorTextura3D_3_3 = texture2D(u_texture3, vUv * 1.55324).xyz;
    vec3 colorTextura3D_3 = mix(mix(colorTextura3D_3_1, colorTextura3D_3_2, 0.5), colorTextura3D_3_3, 0.3);

    // Color textura final
    vec3 colorTexturaFinal = mix(colorTextura3D_1, colorTextura3D_2, colorTextura3D_3);


    // Sol
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    vec3 componenteDifusa = dot(lightVec, vNormal) * vColorDifuso + colorTexturaFinal;

    vec3 reflexVec = normalize(reflect(-lightVec, vNormal));
    vec3 componenteEspecular = pow(max(0.0, dot(reflexVec, camVec)), vGlossiness) * vColorEspecular;

    vec3 color = componenteDifusa + vColorAmbiente + componenteEspecular;

    vec3 colorLuzSol = vec3(1.0, 1.0, 1.0);
    float factorAtenuacionDeIntensidadDeLaLuz = 0.5;
    vec3 intensidadLuzSol = colorLuzSol * factorAtenuacionDeIntensidadDeLaLuz;



    // Proyectil
    vec3 lightVecProyectil = normalize(vPosicionProyectil - vPosWorld);
    vec3 componenteDifusaProyectil = dot(lightVecProyectil, vNormal) * vColorDifuso;
    vec3 reflexVecProyectil = normalize(reflect(-lightVecProyectil, vNormal));
    vec3 componenteEspecularProyectil = pow(max(0.0, dot(reflexVecProyectil, camVec)), vGlossiness) * vColorEspecular;

    vec3 colorProyectil = componenteDifusaProyectil + vColorAmbiente + componenteEspecularProyectil;

    vec3 colorLuzProyectil = vec3(1.0, 1.0, 0.0);
    float factorAtenuacionProyectil = 1.0 / pow(distance(vPosicionProyectil, vPosWorld), 0.8);
    vec3 intensidadLuzProyectil = colorLuzProyectil * factorAtenuacionProyectil;



    // Antorcha1
    vec3 lightVecAntorcha1 = normalize(vPosicionAntorcha1 - vPosWorld);
    vec3 componenteDifusaAntorcha1 = dot(lightVecAntorcha1, vNormal) * vColorDifuso;
    vec3 reflexVecAntorcha1 = normalize(reflect(-lightVecAntorcha1, vNormal));
    vec3 componenteEspecularAntorcha1 = pow(max(0.0, dot(reflexVecAntorcha1, camVec)), vGlossiness) * vColorEspecular;

    vec3 colorAntorcha1 = componenteDifusaAntorcha1 + vColorAmbiente + componenteEspecularAntorcha1;

    vec3 colorLuzAntorcha1 = vec3(1.0, 1.0, 0.01);
    float factorAtenuacionAntorcha1 = 1.0 / pow(distance(vPosicionAntorcha1, vPosWorld), 0.8);
    vec3 intensidadLuzAntorcha1 = colorLuzAntorcha1 * factorAtenuacionAntorcha1;



    // Antorcha2
    vec3 lightVecAntorcha2 = normalize(vPosicionAntorcha2 - vPosWorld);
    vec3 componenteDifusaAntorcha2 = dot(lightVecAntorcha2, vNormal) * vColorDifuso;
    vec3 reflexVecAntorcha2 = normalize(reflect(-lightVecAntorcha2, vNormal));
    vec3 componenteEspecularAntorcha2 = pow(max(0.0, dot(reflexVecAntorcha2, camVec)), vGlossiness) * vColorEspecular;

    vec3 colorAntorcha2 = componenteDifusaAntorcha2 + vColorAmbiente + componenteEspecularAntorcha2;

    vec3 colorLuzAntorcha2 = vec3(1.0, 1.0, 0.0);
    float factorAtenuacionAntorcha2 = 1.0 / pow(distance(vPosicionAntorcha2, vPosWorld), 0.8);
    vec3 intensidadLuzAntorcha2 = colorLuzAntorcha2 * factorAtenuacionAntorcha2;

    vec3 colorFinal = 
        (color * intensidadLuzSol) + 
        (colorProyectil * intensidadLuzProyectil) + 
        (colorAntorcha1 * intensidadLuzAntorcha1) + 
        (colorAntorcha2 * intensidadLuzAntorcha2);
    gl_FragColor = vec4(colorFinal, 1.0);
}