import alfrid, { GL } from 'alfrid'

import vert from './init.vert'
import frag from './init.frag'

const random = function (min, max) { return min + Math.random() * (max - min)	}

export default class ViewInit {
  constructor (params) {
    const extras = []
    const positions = []
    const coords = []
    const colors = []
    const indices = []
    const ages = []
    const lives = []
    const velocities = []
    let count = 1
    // let id = 
    const { numParticles } = params
    const total = numParticles * numParticles
    let ux, uy
    const range = 3
    let color
    for (let j = 0; j < numParticles; j++) {
      for (let i = 0; i < numParticles; i++) {
        positions.push([10000, 0, 0])

        ux = i / numParticles * 2.0 - 1.0 + 0.5 / numParticles
        uy = j / numParticles * 2.0 - 1.0 + 0.5 / numParticles

        let type = .9
        if (count > total / 8 * 6 ) {
          type = 0.
        } else if (count > total / 8 * 4) {
          type = .6
        }
        // const type = count > (total / 3) * 2 ? 0. : count > (total / 3) ? .6 : .9
        // console.log(type);
        
        velocities.push([0, -1, 0])
        lives.push([count % 55, 35 + Math.random() * 20, 0])
        extras.push([Math.random() * 10, i % 2, type]) // random, id, type
        coords.push([ux, uy])
        indices.push(count)
        count++
      }
    }

    this.shader = new alfrid.GLShader(vert, frag)
    this.mesh = new alfrid.Mesh(GL.POINTS)
    this.mesh.bufferVertex(positions)
    this.mesh.bufferData(velocities, 'aVelocity', 1)
    this.mesh.bufferData(lives, 'aLife', 3)
    this.mesh.bufferData(extras, 'aExtra', 3)
    this.mesh.bufferTexCoord(coords)
    this.mesh.bufferIndex(indices)
  }

  render (state = 0) {
    this.shader.bind()
    GL.draw(this.mesh)
  }
}
