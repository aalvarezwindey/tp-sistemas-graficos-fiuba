precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vPosicionSol;
varying vec2 vUv;

void main(void) {
    vec3 nrmX = vec3(abs(vNormal.x), 0.0, 0.0);
    vec3 nrmY = vec3(0.0, abs(vNormal.y), 0.0);
    vec3 nrmZ = vec3(0.0, 0.0, abs(vNormal.z));

    gl_FragColor = vec4(abs(vNormal), 1.0);
}