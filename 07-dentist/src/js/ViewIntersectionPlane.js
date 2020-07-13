// ViewObjModel.js

import alfrid, { GL } from "alfrid";

import fs from "../shaders/basic.frag";
import vs from "../shaders/basic.vert";

class ViewIntersectionPlane extends alfrid.View3D {
  constructor(opti) {
    super(vs, fs);

    this.time = 0;
    this.mesh = alfrid.Geom.plane(1, 1, 1);
  }

  _init() {}

  render() {
    this.shader.bind();

    GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }
}

export default ViewIntersectionPlane;
