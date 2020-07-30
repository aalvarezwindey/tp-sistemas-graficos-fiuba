precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vPosicionSol;
varying vec2 vUv;

void main(void) {
    vec3 lightVec = normalize(vPosicionSol - vPosWorld);
    vec3 diffColor = mix(vec3(0.7, 0.7, 0.7), vNormal, 0.4);
    vec3 color = dot(lightVec, vNormal) * diffColor + vec3(65.0/255.0, 44.0/255.0, 45.0/255.0);

    gl_FragColor = vec4(color, 1.0);
}