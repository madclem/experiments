import alfrid, { GL } from 'alfrid';
import vert from './noise.vert';
import frag from './noise.frag';
import Assets from '../Assets';

const random = function (min, max) { return min + Math.random() * (max - min);	};


export default class ViewNoise extends alfrid.View {
	constructor(params) {
		super(vert, frag);

		this.time = 0;
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureNoise', 'uniform1i', 0);
		this.shader.uniform('textureParticles', 'uniform1i', 1);
    this.shader.uniform('dimensions', 'vec2', [window.innerWidth, window.innerHeight]);
    
    this.textureNoise = Assets.get('noise3')
    this.textureNoise.bind(0)
	}

	render(textureParticles) {
    this.time++
    this.shader.bind()
    this.shader.uniform('time', 'float', this.time);
    this.textureNoise.bind(0)
		textureParticles.bind(1);
		GL.draw(this.mesh);
	}
}