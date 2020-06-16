precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec2 vUv;

void main(void) {
    vec3 lightVec = normalize(vec3(0.0, 3.0, 5.0) - vPosWorld);
    vec3 diffColor = mix(vec3(0.7, 0.7, 0.7), vNormal, 0.4);
    vec3 color = dot(lightVec, vNormal) * diffColor + vec3(0.0, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}