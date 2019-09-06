// ParticlesRenderView.js

import alfrid, { GL } from 'alfrid';

import vert from './render.vert'
import frag from './render.frag'
import Assets from '../Assets';

export default class ViewRender {
	constructor(params) {
		GL.disable(GL.CULL_FACE)
    this.time = 0
    let positions = [];
    let posOffset = [];
    let colors = [];
		let indices = []; 
		let normals = []; 
		let posParticles = []; 
		let uvs = []; 
		let count = 0;

		let {numParticles} = params
		let ux, uy;
		const colorsRef = [[147/255, 232/255, 178/255], [235/255, 87/255, 79/255], [252/255, 219/255, 142/255], [122/255, 172/255, 204/255], [232/255, 233/255, 235/255]];

		uvs.push(
			[0, 0],
			[1, 0],
			[1, 1],
			[0, 1],
		);

		positions.push(
			[0.1, 0.0, 0.0],
			[0.1, 0.1, 0.0],
			[0.0, 0.1, 0.0],
			[0.0, 0.0, 0.0]
		);

		normals.push(
			[0.1, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
		);

		indices.push(
			3,
			2,
			1,
			3,
			1,
			0
		);


		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {				
				ux = i / numParticles;
				uy = j / numParticles;
				
				let x = Math.random() * 20 - 20/2;
				let y = 0;
				let z = Math.random() * 20 - 20/2;
				posOffset.push(
					[x, y, z]
				);
				
				// console.log(ux, uy);
				colors.push(colorsRef[count % colorsRef.length]);
        posParticles.push([ux, uy])
				count ++;
			}
		}
		


		this.time = 0
		this.mesh = 	new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferInstance(colors, 'aColor');
		this.mesh.bufferInstance(posParticles, 'posParticle');
		this.mesh.bufferIndex(indices);

    this.shader = new alfrid.GLShader(vert, frag);
		this.shader.bind()
		this.shader.uniform('uViewport', 'vec2', [window.innerWidth, window.innerHeight]);
		this.shader.uniform('percent', 'float', 0);
		this.shader.uniform('textureStar', 'uniform1i', 4);

		this.textureStar = Assets.get('star')
		this.textureStar.bind(4)
  }
	
	render(textureCurr, textureNext, textureLife, textureExtra, p, mainSpeed) {
		this.time += 0.5
    this.shader.bind();
		this.shader.uniform('textureCurr', 'uniform1i', 0);
		
    textureCurr.bind(0)
		
		this.shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1)
		
		this.shader.uniform('textureLife', 'uniform1i', 2);
		textureLife.bind(2)

		this.shader.uniform('textureExtra', 'uniform1i', 3);
		textureExtra.bind(3)
		
		this.shader.uniform('percent', 'float', p);
		this.shader.uniform('time', 'float', this.time);

		this.textureStar.bind(4)
		
		GL.draw(this.mesh);
	}
}
