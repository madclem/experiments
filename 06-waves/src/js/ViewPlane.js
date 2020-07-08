// ViewObjModel.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import Config from './Config';
import fs from '../shaders/plane.frag';
import vs from '../shaders/plane.vert';

class ViewPlane extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		

		
	}


	_init() {
		this.time = 0;
		this.mesh = alfrid.Geom.plane(10, 10, 80, 'xz');

		const extra = [];

		const val = 0.5;

		for (let i = 0; i < this.mesh.vertices.length; i++) {
			const x = Math.random() * val - val / 2;
			const y = Math.random() * val - val / 2;
			const z = Math.random() * val - val / 2;
			extra.push([
				x, y, z
			]);
		}

		this.mesh.bufferData(extra, 'aExtra', 3);
	}

	render() {
		this.shader.bind();

		this.time += 0.05;
		this.shader.uniform("uTime", "float", this.time);

		const speeds = [0, 0, 0, 0];
		for (let i = 0; i < Config.waves.length; i++) {
			const wave = Config.waves[i];
			speeds[i] = wave.speed;
			this.shader.uniform(`uWave${i+1}`, "vec4", [wave.directionX, wave.directionY, wave.steepness, wave.waveLength]);			
		}
		this.shader.uniform("uSpeed", "vec4", speeds);			

		this.shader.uniform("uLightWorldPosition", "vec3", [2, 4, 0]);

		GL.draw(this.mesh);
	}


}

export default ViewPlane;