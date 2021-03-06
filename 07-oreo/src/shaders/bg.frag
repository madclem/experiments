// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {

    float p = distance(vTextureCoord,vec2(0.5));

    // vec3 color = mix(vec3(1.), vec3(145./255., 95./255., 88./255.), pow(p, .75));
    vec3 color = mix(vec3(1.), vec3(204./255., 160./255., 155./255.), pow(p, .75));

    gl_FragColor = vec4(color, 1.);
}