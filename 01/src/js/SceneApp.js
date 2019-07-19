// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewObjModel from './ViewObjModel';
import ViewInit from './views/ViewInit';
import ViewSim from './views/ViewSim';
import ViewRender from './views/ViewRender';
import Assets from './Assets';

const params = { numParticles: 8, skipCount: 2 };

class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
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
		
		const o = { minFilter:GL.NEAREST, magFilter:GL.NEAREST, type:GL.FLOAT };
		const numParticles = params.numParticles;
		this._fboRead  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboDraw  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fboRead.bind();
		GL.clear(0, 0, 0, 0);
		this._vInit.render();
		this._fboRead.unbind();

		this._fboDraw.bind();
		GL.clear(0, 0, 0, 0);
		this._vInit.render();
		this._fboDraw.unbind();
	}

	updateFBO() {
		this._fboDraw.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(this._fboRead.getTexture(0), this._fboRead.getTexture(1), this._fboRead.getTexture(2), this._fboRead.getTexture(3));
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
		GL.clear(0, 0, 0, 0);
		this._count++
		this.updateFBO();
		this._bAxis.draw();
		this._bDots.draw();
		
		let p = this._count / params.skipCount;
		this._vRender.render(this._fboDraw.getTexture(0), this._fboDraw.getTexture(0), this._fboDraw.getTexture(2), this._fboDraw.getTexture(3), p);

		const size = GL.height / 4;
		for(let i = 0; i < 4; i++) {
			GL.viewport(0, size * i, size, size);
			this._bCopy.draw(this._fboRead.getTexture(i));
		}
	}


	resize() {
		GL.setSize(window.innerWidth, window.innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;