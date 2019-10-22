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
varying float vLife;
varying vec3 vColor;
varying vec3 vExtra;
varying vec3 vPos;

const float radius = 0.01;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 lifeProps   = texture2D(textureLife, uv).rgb;
	vec3 extra   = texture2D(textureExtra, uv).rgb;

	float isDark = extra.z;
	gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;

	if (isDark > 0.5) {
		gl_PointSize = 1. + lifeProps.z * 50.;
	} else {
  	gl_PointSize = distOffset * (.8 + extra.x * 1.0) * pow(1.0 - lifeProps.z, 5.) * 1.2;
	}

	vAlpha = (1. - smoothstep(.98, 1., lifeProps.z)) * smoothstep(0.,0.1, lifeProps.z);
	vLife = lifeProps.z;
	vPos = vec4(uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0)).rgb;
	vExtra = extra;
	

	vColor 	 = aColor;
}