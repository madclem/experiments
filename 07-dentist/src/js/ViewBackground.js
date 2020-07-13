// ViewObjModel.js

import alfrid, { GL } from "alfrid";

import fs from "../shaders/bg.frag";
import vs from "../shaders/bg.vert";
import { fitXY } from "./utils/getCameraDistances";

class ViewBackground extends alfrid.View3D {
  constructor(scene) {
    super(vs, fs);

    this.scene = scene;

    this.time = 0;
    this.mesh = alfrid.Geom.plane(1, 1, 1);
    this.scaleX = 1;
    this.scaleY = 1;
    this.z = 0;
  }

  _init() {}

  render() {
    this.shader.bind();
    this.shader.uniform("uScale", "vec2", [this.scaleX, this.scaleY]);
    this.shader.uniform("uAspectRatio", "vec2", [
      window.innerWidth,
      window.innerHeight,
    ]);
    this.shader.uniform("uPosition", "vec3", [0, 0, this.z]);

    // GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }

  resize() {
    const w = Math.max(window.innerWidth, window.innerHeight);
    const { scaleX, scaleY } = fitXY(
      window.innerWidth,
      window.innerHeight,
      this.z,
      this.scene.camera,
      this.scene.orbitalControl
    );

    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }
}

export default ViewBackground;
