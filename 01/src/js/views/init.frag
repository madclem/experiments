#extension GL_EXT_draw_buffers : require 

precision highp float;

varying vec3 vColor;
varying vec3 vExtra;
varying vec3 vLife;
varying float vVelocity;

void main(void) {
  gl_FragData[0] = vec4(vColor, 1.0); // particles positions rgb
  gl_FragData[1] = vec4(vec3(vVelocity), 1.);
  gl_FragData[2] = vec4(vLife, 1.);
  gl_FragData[3] = vec4(vExtra, 1.);
}