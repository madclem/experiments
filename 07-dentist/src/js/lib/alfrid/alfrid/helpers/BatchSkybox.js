// BatchSkybox.js

import Batch from '../Batch';
import GLShader from '../GLShader';
import Geom from '../Geom';
import fs from '../shaders/skybox.frag';
import vs from '../shaders/skybox.vert';

class BatchSkybox extends Batch {

	constructor(size = 20) {
		const mesh = Geom.skybox(size);
		const shader = new GLShader(vs, fs);

		super(mesh, shader);
	}

	draw(texture) {
		this.shader.bind();
		texture.bind(0);
		super.draw();
	}


}


export default BatchSkybox;