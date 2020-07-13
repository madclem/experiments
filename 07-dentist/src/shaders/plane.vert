// basic.vert

precision highp float;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

// basic.vert

uniform vec4 uSpeed;
uniform vec4 uOffset;
uniform float uTime;
uniform float uSpread;
uniform float uAmount;
uniform vec4 uWave1;
uniform vec4 uWave2;
uniform vec4 uWave3;
uniform vec2 uNoise;
uniform vec2 uFadeEdge;
uniform vec3 uCameraPos;

uniform vec3 uLightWorldPosition;
uniform vec3 uIntersection;
uniform vec2 uScale;
varying vec3 vNormal;
varying vec3 pEye;
varying vec3 vSurfaceToLight;
varying float vColor;
varying float vEdge;
varying float vLightStrength;

vec3 mod289(vec3 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
  return t*t*t*(t*(t*6.-15.)+10.);
}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  
  vec3 x1=x0-i1+1.*C.xxx;
  vec3 x2=x0-i2+2.*C.xxx;
  vec3 x3=x0-1.+3.*C.xxx;
  
  i=mod(i,289.);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  
  float n_=1./7.;
  vec3 ns=n_*D.wyz-D.xzx;
  
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;
  p1*=norm.y;
  p2*=norm.z;
  p3*=norm.w;
  
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float snoise(float x,float y,float z){
  return snoise(vec3(x,y,z));
}

float getDistance(vec3 center,vec3 position,float radius){
  // return clamp(smoothstep(0.05 * uScale.x, .4 * uScale.x, distance(position, center)) / uScale.x, 0., 1.);
  // float totalWidth = uScale.x * 2;
  
  // return clamp(distance(position, center) / radius, 0., 1.);
  // return clamp(smoothstep(0.,radius,distance(position,center)),0.,1.);
  return smoothstep(0.,radius,distance(position,center));
}

float f(vec3 p,float noiseScale){
  return snoise(vec3(p))*noiseScale;
}

vec3 GerstnerWave(vec4 wave,vec3 p,inout vec3 tangent,inout vec3 binormal,float speed,float offset){
  float steepness=wave.z;
  float waveLength=wave.w;
  
  float k=(2.*3.14)/waveLength;// * (1. - invScale * 0.05);
  vec2 d=normalize(wave.xy);
  
  float f=k*(dot(d,p.xz)-uTime*speed+offset);// + sin(uTime) * invScale * 2.;
  float a=steepness/k;
  
  tangent+=vec3(
    -d.x*d.x*(steepness*sin(f))*1.,
    d.x*(steepness*cos(f)),
    -d.x*d.y*(steepness*sin(f))
  );
  
  binormal+=vec3(
    -d.x*d.y*(steepness*sin(f))*1.,
    d.y*(steepness*cos(f)),
    -d.y*d.y*(steepness*sin(f))
  );
  
  return vec3(
    d.x*(a*cos(f))*1.,
    a*sin(f),
    d.y*(a*cos(f))
  );
}

void main(void){
  
  vec3 posInter=aVertexPosition;
  posInter.x*=uScale.x;
  posInter.z*=uScale.y;
  
  vEdge=smoothstep(.4,.49,distance(aVertexPosition.z,.0))*uFadeEdge[1];
  vEdge+=smoothstep(.4,.49,distance(aVertexPosition.x,.0))*uFadeEdge[0];
  
  // position.y += sin(position.x / 10. * 3.14 * 2.) * 2.;
  
  // float time = uTime * 0.1;
  // float time = 1.;
  // float ox = (time) * 0.2;
  // float oy = (time) * 0.83245789;
  
  // vec3 anim = vec3(position.z, 1., 1.) * 1. + vec3(ox, oy, time);
  // float k =
  // vec3 anim = position * 4.;
  
  vec3 newPosition=aVertexPosition;
  newPosition.x*=uScale.x;
  newPosition.z*=uScale.y;
  
  vec3 savedPosition=newPosition;
  
  vec3 tangent=vec3(1.,0.,0.);
  vec3 binormal=vec3(0.,0.,1.);
  
  // float invScale = (1. - dist);
  // ((1. + invScale * 0.2))
  
  newPosition+=GerstnerWave(uWave1,savedPosition,tangent,binormal,uSpeed.x,uOffset.x);
  newPosition+=GerstnerWave(uWave2,savedPosition,tangent,binormal,uSpeed.y,uOffset.y);
  newPosition+=GerstnerWave(uWave3,savedPosition,tangent,binormal,uSpeed.z,uOffset.z);
  
  vec3 modifiedNormal=normalize(cross(binormal,tangent));
  
  float noise=uNoise.x;
  float noiseScale=uNoise.y;
  float time=uTime*.1;
  float ox=time*.2;
  float oy=time*.83245789;
  vec3 anim=vec3(savedPosition)*noise+vec3(ox,oy,time);
  
  vec3 posNoise=newPosition;
  // posNoise.x *= uScale.x;
  // posNoise.z *= uScale.y;
  // vec3 modifiedNormal = normal;
  
  float f0=f(anim,noiseScale);
  float fx=1.*f(anim+vec3(1.,0.,0.),noiseScale);
  float fy=1.*f(anim+vec3(0.,1.,0.),noiseScale);
  float fz=1.*f(anim+vec3(0.,0.,1.),noiseScale);
  
  modifiedNormal=normalize(modifiedNormal-vec3((fx-f0)/1.,(fy-f0)/1.,(fz-f0)/1.));
  // position *= 1.0 + f0 * 0.1 * 1.;
  
  // float f0 =  0.01 * f( aniNormal );
  
  // vec3 newPosition = position;
  // newPosition.z += f0;
  posNoise+=f0;
  
  vec3 posNoiseWorld=vec4(uModelMatrix*vec4(posNoise,1.)).xyz;
  
  vec3 direction=normalize(posNoiseWorld-uIntersection);
  
  float dist=getDistance(posNoiseWorld,uIntersection,uSpread);
  vColor=smoothstep(0.,.8,(1.-dist));
  posNoiseWorld+=smoothstep(0.,.8,(1.-dist))*direction*uAmount;
  
  // posNoise.y *= dist;
  // f2
  
  // f0 = getDistance(worldPos.xyz, uIntersection);
  // fx = 1. * getDistance( worldPos.xyz + vec3( 1., 0.0, 0.0 ), uIntersection);
  // fy = 1. * getDistance( worldPos.xyz + vec3( 0.0, 1., 0.0 ), uIntersection);
  // fz = 1. * getDistance( worldPos.xyz + vec3( 0.0, 0.0, 1. ), uIntersection);
  
  // modifiedNormal = normalize( modifiedNormal - vec3( (fx - f0) / 1., (fy - f0) / 1., (fz - f0) / 1. ) );
  
  // posNoise.y *= f0;
  
  // posNoise = position;
  // posNoise.xz *= uScale;
  
  // (1. - scale)
  // posNoise.y += (1. - dist);
  
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position=uProjectionMatrix*uViewMatrix*vec4(posNoiseWorld,1.);
  // vTextureCoord = aTextureCoord;
  vNormal=normalize(modifiedNormal*uNormalMatrix);
  
  // compute the world position of the surface
  vec3 surfaceWorldPosition=posNoiseWorld;//(modelMatrix * vec4(posNoise, 1.0)).xyz;
  vLightStrength=1.-getDistance(surfaceWorldPosition,uLightWorldPosition,10.);
  
  pEye=normalize(posNoiseWorld.xyz-uCameraPos);
  // Transfomr the *directions* of the normal and position-relative-to-eye so
  // that the matcap stays aligned with the view:
  // vNormal=mat3(viewMatrix)*vNormal;
  vNormal=normalize(vec3(uModelMatrix*vec4(vNormal,0.)));
  
  pEye=mat3(uViewMatrix)*pEye;
  vNormal=mat3(uViewMatrix)*vNormal;
  
  // compute the vector of the surface to the light
  // and pass it to the fragment shader
  
  // vec3 lightPos = uIntersection;
  // lightPos.y = posNoise.y;
  
  // vSurfaceToLight = lightPos - surfaceWorldPosition;
  vSurfaceToLight=uLightWorldPosition-surfaceWorldPosition;
}
