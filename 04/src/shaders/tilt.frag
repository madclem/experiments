// tilt.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uDepthMap;
uniform vec2 uResolutions;
uniform float uNear;
uniform float uFar;
uniform float focus;
uniform sampler2D uTexture;
uniform sampler2D uTextureBlurred;

#define ITERATIONS 10
#define TAU 6.28318530718

highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

//Use last part of hash function to generate new random radius and angle
vec2 mult(inout vec2 r) {
    r = fract(r * vec2(12.9898,78.233));
    return sqrt(r.x + .001) * vec2(sin(r.y * TAU), cos(r.y * TAU));
}

vec3 sample(vec2 uv) {
    return texture2D(uTexture, uv).rgb;
}

vec3 blur(vec2 uv, float radius, float aspect, float offset) {
    vec2 circle = vec2(radius);
    circle.x *= aspect;
    vec2 rnd = vec2(random(vec2(uv + offset)));

    vec3 acc = vec3(0.0);
    for (int i = 0; i < ITERATIONS; i++) {
        acc += sample(uv + circle * mult(rnd)).xyz;
    }
    return acc / float(ITERATIONS);
}

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

void main(void) {
	float n = uNear;
	float f = uFar;
	float z = texture2D(uDepthMap, vTextureCoord.st).x;
	float grey = (2.0 * n) / (f + n - z*(f-n));
	vec4 greyColor = vec4(grey, grey, grey, 1.0);

//   float strength = 0.001 * 10.0 * grey - 0.0;

  // vec3 tex = blur(vTextureCoord, strength, 1.0, 0.0);
  vec3 texBlur = blur13(uTextureBlurred, vTextureCoord, uResolutions, vec2(0, 1.0)).rgb;
  vec3 color = texture2D(uTexture, vTextureCoord).rgb;
  vec3 tex = mix(color, texBlur, abs(greyColor.r - focus));

  // vec2
  gl_FragColor.rgb = tex;
  gl_FragColor.a = 1.0;
  
	// gl_FragColor = vec4(color, 1.);
	// gl_FragColor = greyColor;
}