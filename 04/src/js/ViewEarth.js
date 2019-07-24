// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import { mat4 } from 'gl-matrix'
import vs from '../shaders/earth.vert';
import fs from '../shaders/earth.frag';

class ViewEarth extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}
	
	
	_init() {
		this.tick = 0
		this.mesh = Assets.get('earth');
		this.matrix = mat4.create()

		this.texture = Assets.get('earth-texture')
	}
	
	
	render() {
		
		this.tick += 1/10
		this.shader.bind();
		
		this.shader.uniform('uTexture', 'uniform1i', 0);
		this.texture.bind(0)
		
		// this.shader.uniform('uLight', 'vec3', [window.innerWidth, 0 , .05]);
		// this.shader.uniform('uLightColor', 'vec3', [1, 0, 0]);
		
		mat4.identity(this.matrix)
		const q = quat.create();
		// quat.rotateZ(q, q, Math.PI / 6);
		quat.rotateY(q, q, this.tick / 200);
		quat.rotateX(q, q, this.tick / 200);
		// console.log(q);
		mat4.fromRotationTranslationScaleOrigin(this.matrix, q, [-5 * 5, -25 * 5, -20 * 5], [5, 5, 5], [0,0,0])
		// mat4.translate(this.matrix, this.matrix, [0, 0, 10.])
		// mat4.rotateZ(this.matrix, this.matrix, Math.cos(this.tick / 20) * Math.PI / 6)
		// mat4.translate(this.matrix, this.matrix, [20, -20, -80])
		// mat4.scale(m, m, [0.1, 0.1, 0.1])
		// mat4.translate(m, m, [0, 24.25/, 0])
		

		this.shader.uniform('uMatrix', 'mat4', this.matrix);

		GL.draw(this.mesh);
	}


}

export default ViewEarth;