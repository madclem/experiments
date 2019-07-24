// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * uMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}