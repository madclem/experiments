// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;

float diffuse(vec3 n, vec3 l) {
  float d = dot(normalize(n), normalize(l));
  return max(d, 0.0);
}

float diffuse(vec3 n, vec3 l, float t) {
  float d = dot(normalize(n), normalize(l));
  return mix(1.0, max(d, 0.0), t);
}

void main(void) {
    // float d = diffuse(vNormal, vec3(-2., 1., 0.), .5);

    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);

    float light = dot(vNormal, surfaceToLightDirection);

    gl_FragColor = vec4(1.);
    gl_FragColor.rgb *= pow(light, 2.);
}