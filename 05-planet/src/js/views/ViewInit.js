import alfrid, { GL } from 'alfrid';

import vert from './init.vert';
import frag from './init.frag';

const random = function (min, max) { return min + Math.random() * (max - min);	};

export default class ViewInit {
	constructor(params) {
		const extras = [];
		const positions = [];
		const coords = [];
		const colors = [];
		const indices = []; 
		const ages = [];
		const lives = [];
		const velocities = [];
		let count = 1000;

		const { numParticles } = params;
		let ux, uy;
		const range = 3;
		let color;
		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				positions.push([10000, 0, 0]);

				let dark = count % 10 === 0 ? 0 : 1
				ux = i / numParticles * 2.0 - 1.0 + .5 / numParticles;
				uy = j / numParticles * 2.0 - 1.0 + .5 / numParticles;

				velocities.push([(Math.random() * 10 + 10) * (dark > .5 ? .5 : 0)]);
				lives.push([0, 35 + Math.random() * 20, 0]);
				extras.push([Math.random() * 10, Math.random() * 100, dark]);
				coords.push([ux, uy]);
				indices.push(count);
				count ++;

			}
		}

		this.shader = new alfrid.GLShader(vert, frag);
		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferData(velocities, 'aVelocity', 1);
		this.mesh.bufferData(lives, 'aLife', 3);
		this.mesh.bufferData(extras, 'aExtra', 3);
		this.mesh.bufferTexCoord(coords);
		this.mesh.bufferIndex(indices);
	}

	render(state = 0) {
		this.shader.bind();
		GL.draw(this.mesh);
	}
}