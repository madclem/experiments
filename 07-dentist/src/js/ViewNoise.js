// ViewNoise.js

import alfrid, { GL, View } from 'alfrid';

import fs from 'shaders/noise.frag';

class ViewNoise extends View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);

		this.isMobile = GL.isMobile;
	}


	_init() {
    this.mesh = alfrid.Geom.bigTriangle();
    this.time = 0;
	}


	render(texture) {
    this.time+= 0.01;
    this.time %= 100;
		this.shader.bind();
		this.shader.uniform('texture', 'uniform1i', 0);
		texture.bind(0);	
		this.shader.uniform('uOpacity', 'float', this.isMobile ? 0.08 : 0.12);
		this.shader.uniform('time', 'float', this.time);
		GL.draw(this.mesh);
	}

}

export default ViewNoise;