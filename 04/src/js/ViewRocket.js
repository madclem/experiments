// ViewObjModel.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import { mat4 } from 'gl-matrix'
import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';

class ViewRocket extends alfrid.View {
	
	constructor() {
		super(vs, fs);

	}
	
	
	_init() {
		this.mesh = Assets.get('rocket');
		
		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.tick = 0;
		this.baseColor = [1, 1, 1];

		// gui.add(this, 'roughness', 0, 1);
		// gui.add(this, 'specular', 0, 1);
		// gui.add(this, 'metallic', 0, 1);

		this.matrix = mat4.create()
		// mat4.translate(this.matrix, this.matrix, [-5, -10, 0])
	}
	
	
	render(textureRad, textureIrr, textureAO) {
		
		this.tick++
		this.shader.bind();
		
		this.shader.uniform('uAoMap', 'uniform1i', 0);
		this.shader.uniform('uRadianceMap', 'uniform1i', 1);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		this.shader.uniform('uResolution', 'vec2', [window.innerWidth, window.innerHeight]);
		
		this.shader.uniform('uLight', 'vec3', [window.innerWidth, 0 , .05]);
		this.shader.uniform('uLightColor', 'vec3', [1, 0, 0]);

		textureAO.bind(0);
		textureRad.bind(1);
		textureIrr.bind(2);
		
		mat4.identity(this.matrix)
		const q = quat.create();
		// quat.rotateZ(q, q, Math.PI / 6);
		quat.rotateZ(q, q, -Math.PI / 6 + Math.cos(this.tick / 60) * Math.PI / 12);
		quat.rotateX(q, q, Math.cos(this.tick / 40) * Math.PI / 50);
		// console.log(q);
		mat4.fromRotationTranslationScaleOrigin(this.matrix, q, [0, -24.25/2, 0], [.1, .1, .1], [0, 24.25/2, 0])


		// mat4.translate(m, m, [0, 24.25/2, 0])
		// mat4.rotateZ(m, m, Math.cos(this.tick / 20) * Math.PI / 6)
		// mat4.translate(m, m, [0, -24.25/2, 0])
		// mat4.scale(m, m, [0.1, 0.1, 0.1])
		// mat4.translate(m, m, [0, 24.25/, 0])
		

		this.shader.uniform('uMatrix', 'mat4', this.matrix);
		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);
	}


}

export default ViewRocket;