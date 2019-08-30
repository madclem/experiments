// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid'
import ViewObjModel from './ViewObjModel'
import ViewInit from './views/ViewInit'
import ViewSim from './views/ViewSim'
import ViewRender from './views/ViewRender'
import Assets from './Assets'
import { vec3 } from 'gl-matrix'

const target = vec3.create()

// eslint-disable-next-line func-names
const getMouse = function (mEvent, mTarget) {
  const o = mTarget || {}
  if (mEvent.touches) {
    o.x = mEvent.touches[0].pageX
    o.y = mEvent.touches[0].pageY
  } else {
    o.x = mEvent.clientX
    o.y = mEvent.clientY
  }

  return o
}

const params = { numParticles: 32, skipCount: 2 }

class SceneApp extends Scene {
  constructor () {
    super()

    this.hit = [999, 999, 999]
    this.mouse = { x: 0, y: 0 }
    this.lastPos = { x: 0, y: 0 }
    this.speed = { x: 0, y: 0 }

    GL.enableAlphaBlending()
    this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0
    this.orbitalControl.radius.value = 5
    this.orbitalControl.lock(true)
    this._ray = new alfrid.Ray([0, 0, 0], [0, 0, -1])
  }

  _initTextures () {
    console.log('init textures')
  }

  _initViews () {
    console.log('init views')

    this._count = 0
    this._bCopy = new alfrid.BatchCopy()
    this._bAxis = new alfrid.BatchAxis()
    this._bDots = new alfrid.BatchDotsPlane()

    this._vInit = new ViewInit(params)
    this._vSim = new ViewSim(params)
    this._vRender = new ViewRender(params)


    const glFloat = GL.FLOAT
    const glHalfFloat = GL.HALF_FLOAT
    const unsignedByte = GL.gl.UNSIGNED_BYTE
		const type = glFloat !== unsignedByte ? glFloat : glHalfFloat !== unsignedByte ? glHalfFloat : unsignedByte
		

		
    const o = { minFilter: GL.NEAREST, magFilter: GL.NEAREST, type }
    const numParticles = params.numParticles
    this._fboRead = new alfrid.FrameBuffer(numParticles, numParticles, o, true)
    this._fboDraw = new alfrid.FrameBuffer(numParticles, numParticles, o, true)

    this._fboRead.bind()
    GL.clear(0, 0, 0, 0)
    this._vInit.render()
    this._fboRead.unbind()

    this._fboDraw.bind()
    GL.clear(0, 0, 0, 0)
    this._vInit.render()
    this._fboDraw.unbind()

    this.mesh = alfrid.Geom.plane(100, 100, 1, 'xz')

    window.addEventListener('mousemove', this.onMove.bind(this))
    window.addEventListener('touchmove', this.onMove.bind(this))
  }

  onMove (e) {
    getMouse(e, this.mouse)

    const mx = (e.clientX / GL.width) * 2.0 - 1.0
    const my = -(e.clientY / GL.height) * 2.0 + 1.0

    this.camera.generateRay([mx, my, 0], this._ray)
    this.hit = this._ray.intersectTriangle([10, 10, 0], [-10, 10, 0], [0, -10, 0]) || [999, 999, 999]
  }

  updateFBO () {
    this._fboDraw.bind()
    GL.clear(0, 0, 0, 1)
    this._vSim.render(this._fboRead.getTexture(0), this._fboRead.getTexture(1), this._fboRead.getTexture(2), this._fboRead.getTexture(3), this.hit, this.speed)
    this._fboDraw.unbind()

    // this._fboRead.bind();
    // GL.clear(0, 0, 0, 1);
    // this._vInit.render();
    // this._fboRead.unbind();

    const tmp = this._fboRead
    this._fboRead = this._fboDraw
    this._fboDraw = tmp
  }

  render () {
    GL.clear(0, 0, 0, 0)
    this._count++
    this.updateFBO()
    // this._bAxis.draw();
    // this._bDots.draw();

    this.speed.x = this.mouse.x - this.lastPos.x
    this.speed.y = this.mouse.y - this.lastPos.y

    this.mainSpeed = Math.abs(this.speed.x * this.speed.y)

    const p = this._count / params.skipCount
    this._vRender.render(this._fboDraw.getTexture(0), this._fboDraw.getTexture(0), this._fboDraw.getTexture(2), this._fboDraw.getTexture(3), p, this.mainSpeed)

    // const size = GL.height / 4;
    // for(let i = 0; i < 4; i++) {
    // 	GL.viewport(0, size * i, size, size);
    // 	this._bCopy.draw(this._fboRead.getTexture(i));
    // }


    this.lastPos.x = this.mouse.x
    this.lastPos.y = this.mouse.y
  }

  resize () {
    GL.setSize(window.innerWidth, window.innerHeight)
    this.camera.setAspectRatio(GL.aspectRatio)
  }
}

export default SceneApp
