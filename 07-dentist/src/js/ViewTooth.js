// ViewObjModel.js

import alfrid, { GL } from "alfrid";

import Assets from "./Assets";
import Config from "./Config";
import fs from "../shaders/tooth.frag";
import vs from "../shaders/tooth.vert";

class ViewTooth extends alfrid.View3D {
  constructor(scene) {
    super(vs, fs);

    this.scene = scene;

    this.mouseX = 0;
    this.mouseY = 0;
    this.time = 0;
    this.texture = Assets.get('tooth-texture2');
    this.mesh = Assets.get('tooth2');
  }

  _init() {}

  render(lightPos, mouse) {
    this.shader.bind();

    this.time++;

    this.mouseX += (mouse.x - this.mouseX) * 0.03;
    this.mouseY += (mouse.y - this.mouseY) * 0.03;

    this.x = Config.tooth.position.x + this.mouseX * 1.2;
    this.y = Config.tooth.position.y + Math.cos(this.time / 50.) * 0.5 + this.mouseY * 1.5;
    this.z = Config.tooth.position.z + this.mouseX * 1.2;

    // this.anchorX = Config.tooth.anchor.x;
    // this.anchorY = Config.tooth.anchor.y;
    // this.anchorZ = Config.tooth.anchor.z;

    this.scaleX = Config.tooth.scale.x;
    this.scaleY = Config.tooth.scale.y;
    this.scaleZ = Config.tooth.scale.z;

    this.rotationX = Config.tooth.rotation.x + Math.sin(this.time / 50.) * 0.1 - this.mouseY * Math.PI / 6;
    this.rotationY = Config.tooth.rotation.y + this.mouseX * Math.PI / 6;
    this.rotationZ = Config.tooth.rotation.z + Math.cos(this.time / 100.) * 0.1;

    this.shader.uniform('texture', 'uniform1i', 0);
    this.shader.uniform('uLightPos', 'vec3', [lightPos.x, lightPos.y, lightPos.z]);
		this.texture.bind(0);	
    
    GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }

  resize() {

  }
}

export default ViewTooth;
