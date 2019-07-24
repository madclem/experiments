// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aColor;
// attribute vec3 aPosOffset;
attribute vec2 posParticle;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureLife;
uniform sampler2D textureExtra;
uniform float time;
uniform float percent;
uniform float mainSpeed;
uniform vec2 uViewport;

varying float vAlpha;
varying vec3 vColor;
varying vec2 vUv;

const float radius = 0.01;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

const float PI = 3.141592653;

void main(void) {
	vec2 posParticleUv      = posParticle.xy;
	vec3 posCurr = texture2D(textureCurr, posParticleUv).rgb;
	vec3 posNext = texture2D(textureNext, posParticleUv).rgb;
	// vec3 pos     = aVertexPosition + aPosOffset;
	
	
	vec3 lifeProps   = texture2D(textureLife, posParticleUv).rgb;
	vec3 extra   = texture2D(textureExtra, posParticleUv).rgb;

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;

	vec3 axis = vec3(0.5);//normalize(extra);
	float angle = extra.x + time * 0.1 * mix(extra.x, -.5, .1);
	vec3 posVertex = rotate(aVertexPosition, axis, angle);

	vec3 pos     = posVertex * (1.0 - lifeProps.z);

	pos += mix(posCurr, posNext, percent);

	gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

	// float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
  // gl_PointSize = distOffset * (.8 + extra.x * 1.0) * (1.0 - lifeProps.z);

	vAlpha = (1. - smoothstep(.98, 1., lifeProps.z)) * smoothstep(0.,0.1, lifeProps.z);
	
	vUv = aTextureCoord;
	vColor 	 = aColor;
}