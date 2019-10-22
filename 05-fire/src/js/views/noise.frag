#extension GL_EXT_draw_buffers : require 
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureParticles;
uniform sampler2D textureNoise;
uniform vec2 dimensions;
uniform float time;

varying vec2 vPosition;

float map(float value, float min1, float max1, float min2, float max2) {
	float perc = (value - min1) / (max1 - min1);

	return perc * (max2 - min2) + min2;
}

void main(void) {
	vec4 particles        = texture2D(textureParticles, vTextureCoord).rgba;
	float noise = texture2D(textureNoise, vec2(vTextureCoord.x, vTextureCoord.y - time / 200.) / 2.).r;

	vec3 color = vec3(161./255., 47./255., 47./255.);
	vec3 w = vec3(247./255., 255./255., 97./255.);

	float p = map(particles.r, 1., .6, 1., 0.);
	if (particles.r < 1.) {
		p = pow(1. - vPosition.y, 2.);
	}
		p = pow(1. - vPosition.y, 4.);

	vec3 c = mix(color, w, p);

	float alpha = particles.a * particles.r;

	float dir = vec2(vPosition).r;
	if (alpha == 0.) discard;
	gl_FragColor = vec4(c, 1.0);
	// gl_FragColor = vec4(vec3(p), 1.0);
	// gl_FragColor = vec4(vec3(vPosition.y), 1.0);
	// gl_FragColor = vec4(particles.rgb * vec3(0., 1., 0.), 1.0);
	// gl_FragColor = vec4(vec3(dir), 1.0);
}
