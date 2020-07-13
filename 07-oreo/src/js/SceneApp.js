// SceneApp.js

import alfrid, { GL, Scene } from 'alfrid';

import gsap from 'gsap';
import Assets from './Assets';
import Config from './Config';
import ViewPlane from './ViewPlane';
import ViewBackground from './ViewBackground';
import ViewNoise from './ViewNoise';
import ViewTooth from './ViewTooth';
import { resize } from './utils';

const map = (val, inputMin, inputMax, outputMin, outputMax) => ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;


class SceneApp extends Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this.resize();
	}

	_initTextures() {
		console.log('init textures');
	}

	_initViews() {

		this.transition = 0;
		this.first = true;
		console.log('init views');

		this.orbitalControl.lock();
		this.orbitalControl.rx.setTo(0.3);
		this.orbitalControl.ry.setTo(0.3);
		this.orbitalControl.radius.setTo(20);

		const oSettings = { minFilter: GL.LINEAR, magFilter: GL.LINEAR };
		this.fboNoise = new alfrid.FrameBuffer(GL.width, GL.height, oSettings);

		this.isMoving = false;
		this.lastIntersect = { x: 0, y: 0, z: 0 };
		this.displacementAmount = 0;
		this.targetDisplacementAmount = 0;

		this.lightPos = { x: 0, y: 0, z: -12 };
		this.targetLightPos = { x: 0, y: 0, z: -12 };
		this.tick = 0;
		this.tickZ = 0;
		this.mouse = { x: 0, y: 0 };
		this.time = 0;
		this.getPlanesFromConfig();
		this.interactionPlanes = [];

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this.sphere = new alfrid.BatchBall();
		this.sphereLight = new alfrid.BatchBall();


		this._vNoise = new ViewNoise();
		this._vTooth = new ViewTooth();
		this._vBackground = new ViewBackground(this);		

		setTimeout(()=>{
			gsap.to(this, 6, {
				transition: 1,
				ease: 'circ.out'
			})
		}, 1000);

		// this._vModel = new ViewPlane();

		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
		window.addEventListener('touchmove', this.onMouseMove.bind(this), false);
	}

	onMouseMove(e) {
		if (e.changedTouches && e.changedTouches.length) {
			e.x = e.changedTouches[0].pageX;
			e.y = e.changedTouches[0].pageY;
		}
		if (e.x === undefined) {
			e.x = e.pageX;
			e.y = e.pageY;
		}

		this.isMoving = true;
		this.tickZ++;
		this.mouse.x = (e.x / window.innerWidth) * 2 - 1;
		this.mouse.y = -(e.y / window.innerHeight) * 2 + 1;

		const radiusLight = 10; // 3d radius, needs better calculations
		const ratio = window.innerHeight / window.innerWidth; // 3d radius, needs better calculations
		this.targetLightPos.y = map(this.mouse.y, -1, 1, map(this.mouse.x, -1, 1, -10, 0), map(this.mouse.x, -1, 1, 10, 7.5));
		this.targetLightPos.z = map(this.mouse.x, -1, 1, map(this.mouse.y, -1, 1, -12, -18), map(this.mouse.y, -1, 1, 12, 8));
		this.targetLightPos.x = map(this.mouse.x, -1, 1, -10, map(this.mouse.y, -1, 1, 0, 5));

		this.targetDisplacementAmount = 1;
	}

	getPlanesFromConfig(nb) {
		nb = nb || Config.planes.length;

		this.planes = [];
		for (let i = 0; i < nb; i++) {
			const plane = new ViewPlane();
			this.planes.push(plane);
		}
	}

	render() {
		GL.clear(0, 0, 0, 0);

		this.orbitalControl.rx.value = 0.3 - this.mouse.y * 0.05;
		this.orbitalControl.ry.value = 0.3 + this.mouse.x * 0.05;

		this.displacementAmount +=
      (this.targetDisplacementAmount - this.displacementAmount) * 0.06;

		this.lightPos.x += (this.targetLightPos.x - this.lightPos.x) * 0.05;
		this.lightPos.y += (this.targetLightPos.y - this.lightPos.y) * 0.05;
		this.lightPos.z += (this.targetLightPos.z - this.lightPos.z) * 0.05;

		
		this.fboNoise.bind();
		GL.clear(0, 0, 0, 1);
		
		// this._bAxis.draw();
		// this._bDots.draw();

		GL.disable(GL.DEPTH_TEST);

		this._vBackground.render();

		GL.enable(GL.DEPTH_TEST);

		GL.disable(GL.CULL_FACE);

		if (Config.interaction.debug) {

			if (Config.interaction.showLight) {
				this.sphereLight.draw([this.lightPos.x, this.lightPos.y, this.lightPos.z], [0.1, 0.1, 0.1], [1., 0, 0]);
			}
		}

		// this.transition += (1 - this.transition) * 0.01;


		this.tick++;

		const intersect = {};

		for (let i = 0; i < this.planes.length; i++) {
			const plane = this.planes[i];
      
			const planeData = Config.planes[i];
			if (planeData.visible) plane.render(planeData, this.lightPos, this.displacementAmount, intersect, this.transition);
		}

		GL.enable(GL.CULL_FACE);

		this._vTooth.render(this.lightPos, this.mouse, this.transition);
	
		this.fboNoise.unbind();
    
		if (!this.isMoving) {
			this.targetDisplacementAmount *= 0.96;
		}

		this.isMoving = false;

		if (!this.first) {

			this._vNoise.render(this.fboNoise.getTexture(0));
		}

		this.first = false;
	}

	resize(w, h) {
		resize();
		this.camera.setAspectRatio(GL.aspectRatio);
		this._vBackground.resize();

		const oSettings = { minFilter: GL.LINEAR, magFilter: GL.LINEAR };
		this.fboNoise = new alfrid.FrameBuffer(GL.width, GL.height, oSettings);
	}
}

export default SceneApp;
