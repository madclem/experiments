// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureLife;
uniform sampler2D textureExtra;
uniform float percent;
uniform float mainSpeed;
uniform vec2 uViewport;

varying float vAlpha;
varying vec3 vColor;

const float radius = 0.01;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 lifeProps   = texture2D(textureLife, uv).rgb;
	vec3 extra   = texture2D(textureExtra, uv).rgb;

	gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
  gl_PointSize = distOffset * (.8 + extra.x * 1.0) * (1.0 - lifeProps.z);

	vAlpha = (1. - smoothstep(.98, 1., lifeProps.z)) * smoothstep(0.,0.1, lifeProps.z);
	

	vColor 	 = aColor;
}