precision highp float;
varying vec3 vColor;
varying float vAlpha;
varying float vLife;
varying vec3 vPos;
varying vec3 vExtra;
uniform float time;
uniform vec2 uViewport;
uniform sampler2D textureNoise;


void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;

  // float noise = texture2D(textureNoise, (vPos.xy) / uViewport).r;
  // float noise = texture2D(textureNoise, (vPos.xy + gl_PointCoord) / uViewport).r;
  float noise = texture2D(textureNoise, (vPos.xy + gl_PointCoord) / 100.).r;
  
  vec3 color = vec3(1.);

  if (vExtra.z > 0.5) {
    color = vec3(0., 0., 0.);
  }
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor *= vAlpha;
}