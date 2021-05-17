import alfrid, { GL } from 'alfrid';
import frag from '../../shaders/blur.frag'
import { vec3, mat4 } from 'gl-matrix'


export default class ViewBlur extends alfrid.View {
	constructor(params) {
		super(alfrid.ShaderLibs.bigTriangleVert, frag);

		this.time = 0;
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('uTexture', 'uniform1i', 0);
		this.shader.uniform('uResolutions', 'vec2', [window.innerWidth, window.innerHeight]);
	}

	render(texture) {
    this.shader.bind()
    texture.bind(0)
		GL.draw(this.mesh);
	}
}