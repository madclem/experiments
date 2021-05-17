// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import Config from './config';
import { mat4 } from 'gl-matrix'
import vs from '../shaders/earth.vert';
import fs from '../shaders/earth.frag';

class ViewEarth extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}
	
	
	_init() {
		this.tick = 0
		// this.mesh = alfrid.Geom.sphere(1, 12 * 2);
		// this.mesh = Assets.get('earth');
		this.mesh = Assets.get('earth');
		this.matrix = mat4.create()

		this.texture = Assets.get('earth-texture')
	}
	
	
	render() {
		
		this.tick += 1/10
		this.shader.bind();
		
		this.shader.uniform('uTexture', 'uniform1i', 0);
		this.shader.uniform('uDimensions', 'vec2',[window.innerWidth, window.innerHeight]);
		this.texture.bind(0)
		
		this.shader.uniform("uPointLightPosition", "vec3", [-100., 100, 100]);
		
	
		this.shader.uniform("uPointLightColor", "vec3", [1, 1, 1]);
		this.shader.uniform("uPointLightIntensity", "float", 1);
		this.shader.uniform("uPointLightDistance", "float", 100);
		this.shader.uniform("uShininess", "float", 1);

		
		mat4.identity(this.matrix)
		// const q = quat.create();
		let scale = 12
		// mat4.fromScaling(this.matrix, [scale * 12, scale * 12, scale * 12])
		mat4.fromScaling(this.matrix, [scale	, scale	, scale	])
		mat4.fromTranslation(this.matrix, [-5, -25, -20])
		// quat.rotateY(q, q, this.tick / 200);
		// quat.rotateX(q, q, this.tick / 200);
		// mat4.fromRotationTranslationScaleOrigin(this.matrix, q, [-5 * scale,-15 * scale, -20 * scale], [.12 * scale, .12 * scale, .12 * scale], [0,0,0])
		// mat4.fromRotationTranslationScaleOrigin(this.matrix, q, [-5 * scale, -15 * scale, -20 * scale], [6 * scale, 6 * scale, 6 * scale], [0,0,0])
		// mat4.fromRotationTranslationScaleOrigin(this.matrix, q, [-5 * scale, -25 * scale, -20 * scale], [scale, scale, scale], [0,0,0])
		

		this.shader.uniform('uMatrix', 'mat4', this.matrix);

		GL.draw(this.mesh);
	}


}

export default ViewEarth;