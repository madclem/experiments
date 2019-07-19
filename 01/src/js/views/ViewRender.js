// ParticlesRenderView.js

import alfrid, { GL } from 'alfrid';

import vert from './render.vert'
import frag from './render.frag'

export default class ViewRender {
	
	constructor(params) {
    this.time = 0
    let positions = [];
		let indices = []; 
		let count = 0;

		let {numParticles} = params
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {				
				ux = i / numParticles;
				uy = j / numParticles;
				
				// console.log(ux, uy);
				
        positions.push([ux, uy, 0.0])
				indices.push(count);
				count ++;
			}
    }
    
    this.shader = new alfrid.GLShader(vert, frag);
		this.shader.bind()
		this.shader.uniform('uViewport', 'vec2', [window.innerWidth, window.innerHeight]);
		this.shader.uniform('percent', 'float', 0);
		
		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);	
		this.mesh.bufferIndex(indices);
  }
	
	render(textureCurr, textureNext, textureLife, textureExtra, p) {
		
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
		
		GL.draw(this.mesh);
	}
}
