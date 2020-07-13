// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
uniform sampler2D texture;

uniform float uOpacity;
// uniform vec2 uScreenSize;
uniform float time;
varying vec2 vTextureCoord;

      
      float blendSoftLight(float base,float blend){
        return(blend<.5)?(2.*base*blend+base*base*(1.-2.*blend)):(sqrt(base)*(2.*blend-1.)+2.*base*(1.-blend));
      }
      
      vec3 blendSoftLight(vec3 base,vec3 blend){
        return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
      }
      
      vec3 blendSoftLight(vec3 base,vec3 blend,float opacity){
        return(blendSoftLight(base,blend)*opacity+base*(1.-opacity));
      }
      
      float blendAdd(float base,float blend){
        return min(base+blend,1.);
      }
      
      vec3 blendAdd(vec3 base,vec3 blend){
        return min(base+blend,vec3(1.));
      }
      
      vec3 blendAdd(vec3 base,vec3 blend,float opacity){
        return(blendAdd(base,blend)*opacity+base*(1.-opacity));
      }
      
      float random(vec2 st){
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
      }
      
      float mapValue(float value,float min1,float max1,float min2,float max2){
        return min2+(value-min1)*(max2-min2)/(max1-min1);
      }
      
      void main(){
        
        // vec2 uv=(vTextureCoord);
        // // vec2 u= mod(vTextureCoord * 10.);
        // float division=mapValue(uScale,0.,1.,.00001,.01);
        // float u=floor(uv.x/division);
        // u=u*division;
        
        // float v=floor(uv.y/division);
        // v=v*division;
        // float u=step(uv.x,.5);
        // float g=random(vec2(u, v)+time);
        
        float g=random(vTextureCoord+vec2(time));
        vec3 colorBase=texture2D(texture,vTextureCoord).rgb;
        vec3 color=mix(colorBase,blendSoftLight(colorBase,vec3(g)),uOpacity);

        gl_FragColor=vec4(color,1.);
        // gl_FragColor=vec4(vec3(u),1.);
      }
      