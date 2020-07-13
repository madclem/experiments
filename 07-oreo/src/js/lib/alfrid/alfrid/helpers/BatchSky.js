// BatchSky.js

import Batch from '../Batch';
import GLShader from '../GLShader';
import Geom from '../Geom';
import fs from '../shaders/copy.frag';
import vs from '../shaders/sky.vert';

class BatchSky extends Batch {

	constructor(size = 50, seg = 24) {
		const mesh = Geom.sphere(size, seg, true);
		const shader = new GLShader(vs, fs);

		super(mesh, shader);
	}

	draw(texture) {
		this.shader.bind();
		texture.bind(0);
		super.draw();
	}
}

export default BatchSky;