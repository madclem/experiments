import alfrid, { GL } from 'alfrid';
import frag from './sim.frag';
import { vec3, mat4 } from 'gl-matrix'

const random = function (min, max) { return min + Math.random() * (max - min);	};


export default class ViewInit extends alfrid.View {
	constructor(params) {
		super(alfrid.ShaderLibs.bigTriangleVert, frag);

		this.time = 0;
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('texturePos', 'uniform1i', 0);
		this.shader.uniform('textureVel', 'uniform1i', 1);
		this.shader.uniform('textureLife', 'uniform1i', 2);
		this.shader.uniform('textureExtra', 'uniform1i', 3);
		this.shader.uniform('dimensions', 'vec2', [window.innerWidth, window.innerHeight]);
	}

	render(texturePos, textureVel, textureLife, textureExtra, spawn, speed, modelMatrix) {

		this.time += 0.5
		
		this.shader.bind()
		this.shader.uniform('time', 'float', this.time);
		texturePos.bind(0);
		textureVel.bind(1);
		textureLife.bind(2);
		textureExtra.bind(3);

		
		spawn = vec3.create()
		vec3.transformMat4(spawn, spawn, modelMatrix)

		let mainSpeed = Math.min(1, Math.abs(speed.x * speed.y))

		let speedX = speed.x
		let speedY = speed.y
		if (mainSpeed < .01) {
			mainSpeed = .01
			speedX = this.time
			speedY = this.time
		}
		this.shader.uniform('spawnPos', 'vec3', spawn);
		this.shader.uniform('speed', 'vec2', [speedX, speedY]);
		this.shader.uniform('mainSpeed', 'float', mainSpeed);

		GL.draw(this.mesh);
	}
}