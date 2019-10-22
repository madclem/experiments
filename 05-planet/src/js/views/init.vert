precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aLife;
attribute vec3 aExtra;
attribute vec2 aTextureCoord;
attribute float aVelocity;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vPos;
varying vec3 vExtra;
varying vec3 vLife;
varying float vVelocity;

void main(void) {
	vPos       = aVertexPosition;
	vec3 pos     = vec3(aTextureCoord, 0.0);
	// gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position  = vec4(pos, 1.0);
	gl_PointSize = 1.0;


	vVelocity    = aVelocity;
	vExtra       = aExtra;
	vLife       = aLife;
}