precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vPosicionSol;

varying vec3 vColorAmbiente;
varying vec3 vColorDifuso;

varying vec2 vUv;

void main(void) {
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    vec3 diffColor = mix(vec3(0.7, 0.7, 0.7), vNormal, 0.4);
    vec3 color = dot(lightVec, vNormal) * vColorDifuso + vColorAmbiente;

    gl_FragColor = vec4(color, 1.0);
}