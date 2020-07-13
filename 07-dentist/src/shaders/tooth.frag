// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;
uniform vec3 uLightPos;

float diffuse(vec3 n,vec3 l){
  float d=dot(normalize(n),normalize(l));
  return max(d,0.);
}

float diffuse(vec3 n,vec3 l,float t){
  float d=dot(normalize(n),normalize(l));
  return mix(1.,max(d,0.),t);
}

void main(void) {
    float d = diffuse(vNormal, uLightPos, .25);

    gl_FragColor = texture2D(texture, vTextureCoord);
    gl_FragColor.rgb += 0.1;
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(2.5));
    gl_FragColor.rgb *= d;
}