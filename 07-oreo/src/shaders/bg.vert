// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uPosition;
uniform vec2 uScale;
uniform vec2 uAspectRatio;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {

    vec3 cameraRight = vec3(

        
        uViewMatrix[0].x, uViewMatrix[1].x, uViewMatrix[2].x
    );
    vec3 cameraUp = vec3(
        uViewMatrix[0].y, uViewMatrix[1].y, uViewMatrix[2].y
    );

    vec3 pos = uPosition + (cameraRight * uScale.x * aVertexPosition.x) + (cameraUp * uScale.y * aVertexPosition.y);


    gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);

    // vec3 pos = uPosition;
    //     gl_Position =  uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
    //     gl_Position /= gl_Position.w;
    //     gl_Position.xy += (aVertexPosition.xy * vec2(1., uAspectRatio) * uScale * 1.);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}