import alfrid, { GL } from 'alfrid';
import frag from '../../shaders/tilt.frag'
import { vec3, mat4 } from 'gl-matrix'

const random = function (min, max) { return min + Math.random() * (max - min);	};


export default class ViewTilt extends alfrid.View {
	constructor(params) {
		super(alfrid.ShaderLibs.bigTriangleVert, frag);

		this.time = 0;
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('uDepthMap', 'uniform1i', 0);
		this.shader.uniform('uTexture', 'uniform1i', 1);
		this.shader.uniform('uTextureBlurred', 'uniform1i', 2);
    this.shader.uniform('uResolutions', 'vec2', [window.innerWidth, window.innerHeight]);
    

    this.uNear = 1
    this.focus = 0
    this.uFar = 500
    gui.add(this, 'uNear', 0, 1000);
    gui.add(this, 'focus', 0, 1);
    gui.add(this, 'uFar', 0, 10000);
	}

	render(depthMap, texture, textureBlurred) {

		this.time += 0.5
    this.shader.bind()
    this.shader.uniform('uNear', 'float', this.uNear);
    this.shader.uniform('uFar', 'float', this.uFar);
    this.shader.uniform('focus', 'float', this.focus);
    depthMap.bind(0)
    texture.bind(1)
    textureBlurred.bind(2)
		GL.draw(this.mesh);
	}
}