// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uTexture;

void main(void) {
    gl_FragColor = texture2D(uTexture, vTextureCoord);
}