#extension GL_EXT_draw_buffers : require 
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureParticles;
uniform sampler2D textureNoise;
uniform vec2 dimensions;
uniform float time;

varying vec2 vPosition;

void main(void) {
	vec4 particles        = texture2D(textureParticles, vTextureCoord).rgba;
	float noise        = texture2D(textureNoise, vTextureCoord * 1. + vec2(0., -time / 120.)).r;

  float life = 1.0 - particles.r;
  // noise *= particles.a;

  vec3 flame = step(life, noise * particles.a) * vec3(1.);

	gl_FragColor = vec4(particles.rgb, 1.0);
	// gl_FragColor = vec4(flame, 1.0);
	// gl_FragColor = vec4(noise);
}
