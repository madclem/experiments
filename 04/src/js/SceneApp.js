// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewRocket from './ViewRocket';
import ViewEarth from './ViewEarth';
import ViewInit from './views/ViewInit';
import ViewSim from './views/ViewSim';
import ViewRender from './views/ViewRender';
import ViewTilt from './views/ViewTilt';
import ViewBlur from './views/ViewBlur';
import Assets from './Assets';
import { vec3 } from 'gl-matrix';

let target = vec3.create();

// eslint-disable-next-line func-names
const getMouse = function (mEvent, mTarget) {
	const o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

const params = { numParticles: 32, skipCount: 2 };

class SceneApp extends Scene {
	constructor() {
		super();

		GL.disable(GL.CULL_FACE)
		GL.enable(GL.BLEND)
		console.log('GL', GL);
		
		// GL.enable(GL.CULL_FACE)

		this.hit = [999,999,999]
		this.mouse = {x:0, y:0}
		this.lastPos = {x:0, y:0}
		this.speed = {x:0, y:0}
		
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0;
		this.orbitalControl.radius.value = 5;
		// this.orbitalControl.lock(true)
		this._ray = new alfrid.Ray([0, 0, 0], [0, 0, -1]);
		
	}
	
	_init() {
		super._init()

		this.camera.setPerspective(45 * Math.PI / 180, GL.aspectRatio, 0.1, 1000);
	}
	_initTextures() {
		console.log('init textures');
	}
	

	_initViews() {
		console.log('init views');
		
		this._count = 0
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		
		this._vInit = new ViewInit(params);
		this._vSim = new ViewSim(params);		
		this._vRender = new ViewRender(params);		
		this._vTilt = new ViewTilt(params);		
		this._vBlur = new ViewBlur(params);		
		
		const o = { minFilter:GL.NEAREST, magFilter:GL.NEAREST, type:GL.FLOAT };
		const o2 = { minFilter:GL.NEAREST, magFilter:GL.NEAREST };
		const numParticles = params.numParticles;
		this._fboRead  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboDraw  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboRender  	= new alfrid.FrameBuffer(GL.width, GL.height);
		this._fboBlur  	= new alfrid.FrameBuffer(GL.width, GL.height, o2);

		this._vRocket = new ViewRocket();
		this._vEarth = new ViewEarth();

		this._fboRead.bind();
		GL.clear(0, 0, 0, 0);
		this._vInit.render();
		this._fboRead.unbind();

		this._fboDraw.bind();
		GL.clear(0, 0, 0, 0);
		this._vInit.render();
		this._fboDraw.unbind();


		window.addEventListener('mousemove', this.onMove.bind(this));
		window.addEventListener('touchmove', this.onMove.bind(this));
	}

	onMove(e) {

		getMouse(e, this.mouse)

		const mx = (e.clientX / GL.width) * 2.0 - 1.0;
		const my = - (e.clientY / GL.height) * 2.0 + 1.0;

		this.camera.generateRay([mx, my, 0], this._ray);
		this.hit = this._ray.intersectTriangle([10, 10, 0], [-10, 10, 0], [0, -10, 0]) || [999,999,999];
	}

	updateFBO() {		
		this._fboDraw.bind();
		GL.clear(0, 0, 0, 0);
		// this._vSim.render(this._fboRead.getTexture(0), this._fboRead.getTexture(1), this._fboRead.getTexture(2), this._fboRead.getTexture(3), this.hit, this.speed);
		this._vSim.render(this._fboRead.getTexture(0), this._fboRead.getTexture(1), this._fboRead.getTexture(2), this._fboRead.getTexture(3), [-5 * 0.1, -10 * 0.1, 0.], this.speed, this._vRocket.matrix);
		this._fboDraw.unbind();

		// this._fboRead.bind();
		// GL.clear(0, 0, 0, 1);
		// this._vInit.render();
		// this._fboRead.unbind();


		const tmp = this._fboRead;
		this._fboRead = this._fboDraw;
		this._fboDraw  = tmp;
	}

	render() {

		
		GL.clear(28/255, 31/255, 41/255, 0);
		this._count++
		this.updateFBO();
		this._bAxis.draw();
		this._bDots.draw();

		// this.speed.x = this.mouse.x - this.lastPos.x
    // this.speed.y = this.mouse.y - this.lastPos.y
		

		// this.mainSpeed = Math.abs(this.speed.x * this.speed.y)

		let p = this._count / params.skipCount;

		this._fboRender.bind()
		GL.clear(28/255, 31/255, 41/255, 0);
		this._vRender.render(this._fboDraw.getTexture(0), this._fboDraw.getTexture(0), this._fboDraw.getTexture(2), this._fboDraw.getTexture(3), p, this.mainSpeed);
		this._vEarth.render();
		this._vRocket.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('rocket_texture'));
		this._fboRender.unbind()

		this._fboBlur.bind()
		GL.clear(28/255, 31/255, 41/255, 1);
		this._vBlur.render(this._fboRender.getTexture(0))
		this._fboBlur.unbind()

		this._vTilt.render(this._fboRender.getDepthTexture(), this._fboRender.getTexture(0), this._fboBlur.getTexture(0))
		
		// const size = GL.height / 4;
		// for(let i = 0; i < 4; i++) {
		// 	GL.viewport(0, size * i, size, size);
		// 	this._bCopy.draw(this._fboRead.getTexture(i));
		// }

		// GL.viewport(0, 0, GL.width, GL.height);
		// this._bCopy.draw(this._fboBlur.getTexture(0));
		

		this.lastPos.x = this.mouse.x
		this.lastPos.y = this.mouse.y
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;