import alfrid, { GL } from 'alfrid'
import vert from '../../shaders/planet.vert'
import frag from '../../shaders/planet.frag'
import Assets from '../Assets'

const random = function (min, max) { return min + Math.random() * (max - min)	}

export default class ViewNoise extends alfrid.View {
  constructor () {
    super(vert, frag)
    this.time = 0
    this.mesh = alfrid.Geom.sphere(1, 20)
  }

  render () {
    this.time++
    this.shader.bind()
    this.shader.uniform('time', 'float', this.time)
    GL.draw(this.mesh)
  }
}
