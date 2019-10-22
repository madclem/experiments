#extension GL_EXT_draw_buffers : require 
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D textureVel;
uniform sampler2D texturePos;
uniform sampler2D textureLife;
uniform sampler2D textureExtra;
uniform vec3 spawnPos;
uniform vec2 speed;
uniform vec2 dimensions;
uniform float time;
uniform float mainSpeed;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;  }

vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;  }

vec4 permute(vec4 x) {  return mod289(((x*34.0)+1.0)*x);  }

vec4 taylorInvSqrt(vec4 r) {  return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v) { 
	const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
	const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

	vec3 i  = floor(v + dot(v, C.yyy) );
	vec3 x0 =   v - i + dot(i, C.xxx) ;

	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );

	vec3 x1 = x0 - i1 + C.xxx;
	vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
	vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

	i = mod289(i); 
	vec4 p = permute( permute( permute( 
						 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
					 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
					 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

	float n_ = 0.142857142857; // 1.0/7.0
	vec3  ns = n_ * D.wyz - D.xzx;

	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);

	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );

	vec4 s0 = floor(b0)*2.0 + 1.0;
	vec4 s1 = floor(b1)*2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));

	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);

	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;

	vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	m = m * m;
	return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
																dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3( vec3 x ){

	float s  = snoise(vec3( x ));
	float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
	float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
	vec3 c = vec3( s , s1 , s2 );
	return c;

}


vec3 curlNoise( vec3 p ){
	
	const float e = .1;
	vec3 dx = vec3( e   , 0.0 , 0.0 );
	vec3 dy = vec3( 0.0 , e   , 0.0 );
	vec3 dz = vec3( 0.0 , 0.0 , e   );

	vec3 p_x0 = snoiseVec3( p - dx );
	vec3 p_x1 = snoiseVec3( p + dx );
	vec3 p_y0 = snoiseVec3( p - dy );
	vec3 p_y1 = snoiseVec3( p + dy );
	vec3 p_z0 = snoiseVec3( p - dz );
	vec3 p_z1 = snoiseVec3( p + dz );

	float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
	float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
	float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

	const float divisor = 1.0 / ( 2.0 * e );
	return normalize( vec3( x , y , z ) * divisor );

}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(void) {
	vec3 pos        = texture2D(texturePos, vTextureCoord).rgb;
	vec3 vel        = texture2D(textureVel, vTextureCoord).rgb;
	vec3 lifeProps      = texture2D(textureLife, vTextureCoord).rgb;
	vec3 extra      = texture2D(textureExtra, vTextureCoord).rgb;

	
	float aAge = lifeProps.x;
	float age = time - aAge;
	float life = lifeProps.y;
	
	float isDark = extra.z;

  if (age > life - 1.0) {
    float ra = random(vec2(extra.x * time));
		float posOffset = (0.5 + extra.x * 0.2) * 0.25 * ra;
		vec3 r = curlNoise(pos * posOffset + time * 0.343);

		float divide = 1.0;
		if (extra.z == .9) {
			vel	= vec3(r.x, 2. * ra + extra.x * .2, 0.) * 1.;

			// vel *= 1.2;
			// vel	= vec3(r.x * .6, 2. * ra + extra.x * .2, 0.) * 1.;
			float plus = 0.;
			if (extra.x < .1) {
				// plus += 1.;
				// vel *= 2.;
			}
			pos = vec3(r.x * 0.03, r.y * 0.03, 1. + plus);
			// pos = vec3(sin(time / 20. + extra.x / 10.) * 0.03, cos(time / 40. + extra.x / 10.) * 0.03, 1.);
		} else if (extra.z == .6) {
			vel	= vec3(0., 1. + 1. * ra + extra.x * .2, 0.) * 1.;
			float rand = extra.y;
			float plus = 0.;
			if (extra.x < .1) {
				rand = abs(sin(time));
				// vel.y *= 2.;
				
			}

			pos = vec3(-.20 + rand * .20 * (2.) + r.x * .02, r.y * 0.08, 1.1);
		} else {
			vel	= vec3(0., 1. + 1. * ra + extra.x * .2, 0.) * 1.;

			float rand = extra.y;
			float extraY = 0.;
			if (extra.x < .5) {
				rand = abs(sin(time));
				extraY = .3;
				vel.y *= 1.2;
			}

			vel.y *= 1.3;
			pos = vec3(-.35 + rand * .35 * (2.) + r.x * .08, r.y * 0.18 + extraY, 1.12);
		}

																										// if (isDark > 0.5) {
																										// 	vel	= vec3(cos(time) / 2., sin(time)/2., 0.) * 1.;
																										// 	pos = vec3(0. + vel.x * .1, 0. + vel.y * .1, 1.);
																										// } else {
																										// 	pos = vec3(r.x * 0.02, r.y * 0.02, 1.);
																										// 	vel	= vec3(cos(time) + r.x, sin(time) + r.y, 0.) * 1.;
																										// }
		aAge = time;// + (1.0 - mainSpeed) * (life - 1.0);
  } else {

		if (extra.z == .9) {
			vel.x *= 0.9;
			pos.x *= 0.999;
			// vel.y *= 0.99;
			// pos.z *= 0.99;
		} else if (extra.z == .6) {
			pos.x *= 0.98;
			// vel.y *= 0.99;
		} else {
			pos.x *= 0.999;
		}

    pos.xy += .01 * vel.xy;
  }

	gl_FragData[0] = vec4(pos, 1.0);
	gl_FragData[1] = vec4(vel, 1.0);
	gl_FragData[2] = vec4(aAge, life, (time - aAge) / life, 1.0);
	gl_FragData[3] = vec4(extra, 1.0);
}
