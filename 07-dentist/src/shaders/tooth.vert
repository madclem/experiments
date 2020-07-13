// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {

	vec3 smoothNormal = normalize(aVertexPosition.xyz);
	float percentageSmooth = 1.;
	// vNormal       = normalize(vec3(uNormalMatrix * vec4(mix(aNormal, smoothNormal, percentageSmooth), 0.0)));
	vNormal       = mix(aNormal, smoothNormal, percentageSmooth);

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    // vNormal = aNormal;
}