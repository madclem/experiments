// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vPos;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    // gl_FragColor = texture2D(texture, vTextureCoord);
    float pct = distance(vPos.xyz ,vec3(.5));
    gl_FragColor = vec4(vec3(pct), 1.);
    // gl_FragColor = vec4(vTextureCoord, 0., 1.);
}