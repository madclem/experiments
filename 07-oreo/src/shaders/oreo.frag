// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;
uniform vec3 uLightPos;
uniform float uAlpha;

float diffuse(vec3 n,vec3 l){
  float d=dot(normalize(n),normalize(l));
  return max(d,0.);
}

float diffuse(vec3 n,vec3 l,float t){
  float d=dot(normalize(n),normalize(l));
  return mix(1.,max(d,0.),t);
}

void main(void) {
    float d = abs(diffuse(normalize(vNormal), uLightPos, .7)) + 0.2;

    gl_FragColor = texture2D(texture, vTextureCoord);
    gl_FragColor.rgb += 0.05;
    gl_FragColor.rgb *= (1. + d);
    gl_FragColor *= uAlpha;
}