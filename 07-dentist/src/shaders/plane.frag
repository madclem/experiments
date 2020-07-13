precision highp float;

uniform sampler2D uTexture;
uniform vec3 uCameraPos;
uniform float uShowLight;
uniform float uAlpha;
uniform float uShowContact;

varying vec3 pEye;
varying vec3 vNormal;
varying vec3 vSurfaceToLight;
varying float vColor;
varying float vEdge;
varying float vLightStrength;

float diffuse(vec3 n,vec3 l){
  float d=dot(normalize(n),normalize(l));
  return max(d,0.);
}

float diffuse(vec3 n,vec3 l,float t){
  float d=dot(normalize(n),normalize(l));
  return mix(1.,max(d,0.),t);
}

vec2 matcap(vec3 eye,vec3 normal){
  vec3 reflected=reflect(eye,normal);
  float m=2.8284271247461903*sqrt(reflected.z+1.);
  return reflected.xy/m+.5;
}

float blendAdd(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}
void main(void){
  float d = diffuse(vNormal, vec3(-2., 1., 0.), .5);
  
  vec3 surfaceToLightDirection=normalize(vSurfaceToLight);
  
  float light= clamp(dot(vNormal,surfaceToLightDirection)*vLightStrength, 0., 1.);
  
  vec2 uv=matcap(pEye,normalize(vNormal));
  // vec2 uv=vec2(normalize(pEye*vNormal))*.5+vec2(.5,.5);
  
  // vec2 uv=matcap(uCameraPos,vNormal);
  
  // vec3 colorMatcap= texture2D(uTexture,vec2(uv.x,1.-uv.y)).rgb*(1.+abs(light)*1.5);
  vec3 colorMatcap= texture2D(uTexture,vec2(uv.x,1.-uv.y)).rgb;
  vec3 colorLight=vec3(abs(light));
  
  // vec3 color = colorMatcap;
  // vec3 color=mix(pow(colorMatcap,vec3(1.25))*1.25,colorLight,uShowLight);
  vec3 color=mix(colorMatcap,colorLight + d * 0.1,uShowLight);
  color=mix(color,vec3(vColor),uShowContact);

  color = blendAdd(color, vec3(min(1., 0.25 + min(0.6, light))));
  
  gl_FragColor=vec4(color,1.-vEdge);
  gl_FragColor*=uAlpha;
  // gl_FragColor += d * 0.75;
  // gl_FragColor += light;
  // gl_FragColor=vec4(vec3(vEdge),1.);
  
  // gl_FragColor=vec4(1.);
  
  // gl_FragColor.rgb*=1.-lightDebug;
  // gl_FragColor.rgb *= ;
  // gl_FragColor.rgb*=(1.-light*.8);
  // gl_FragColor.rgb= vec3(lightDebug);
}
