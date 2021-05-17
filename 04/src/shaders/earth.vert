// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vPosition;

void main(void) {
    vec3 p = aVertexPosition;
    vPosition = vec4(aVertexPosition, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * uMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal =  aNormal;
}