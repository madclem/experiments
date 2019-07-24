precision highp float;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vUv;

uniform sampler2D textureStar;

void main(void) {
	vec4 color        = texture2D(textureStar, vUv);
  color.rgb *= vColor;

  if (color.a < 0.2) discard;
  gl_FragColor = vec4(color.rgb, color.a);
  gl_FragColor *= color.a;
}