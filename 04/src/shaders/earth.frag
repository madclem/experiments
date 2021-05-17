// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform sampler2D uTexture;
uniform vec3 uPointLightPosition;
uniform vec3 uPointLightColor;
uniform float uPointLightIntensity;
uniform float uPointLightDistance;
uniform float uShininess;
uniform vec2 uDimensions;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vPosition;

// uniform vec3 uSpecular;

#define saturate(a) clamp( a, 0.0, 1.0 )


float diffuse(vec3 N, vec3 L) {
    return max(dot(N, L), 0.0);
}


vec3 diffuseLighting(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}


vec3 pointLighting(vec3 N, vec3 V) {
    vec3 pointWeight = vec3(0.0);

    vec3 L = normalize(uPointLightPosition - vPosition.rgb);
    float dist = length(uPointLightColor);

    float attenuation = pow(  saturate(-dist / uPointLightDistance + 1.0) , 1. );

    pointWeight += diffuseLighting(N,L,uPointLightColor * uPointLightIntensity) * attenuation;
    
    return pointWeight;
}


void main(void) {

    vec3 color = texture2D(uTexture, vTextureCoord).rgb;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(vPosition.rgb);

    color = vec3(1.);
    vec3 lighting = color;
    lighting *= pointLighting(N,V);

    gl_FragColor = vec4(lighting, 1.0);
    // gl_FragColor = vec4(vec3(N), 1.0);
    // gl_FragColor = texture2D(uTexture, vTextureCoord);
}