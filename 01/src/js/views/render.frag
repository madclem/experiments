precision highp float;
varying vec4 vColor;
varying float vAlpha;

void main(void) {
	if(distance(gl_PointCoord, vec2(.5)) > .5) discard;
  gl_FragColor = vec4(1.);
  gl_FragColor *= vAlpha;
}