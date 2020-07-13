// ViewObjModel.js

import alfrid, { GL } from "alfrid";

import Assets from "./Assets";
import Config from "./Config";
import fs from "../shaders/plane.frag";
import vs from "../shaders/plane.vert";

class ViewPlane extends alfrid.View3D {
  constructor(opti) {
    super(vs, fs);

		this.matcapTexture = Assets.get('matcap2')
    this.time = 0;
    this.mesh = alfrid.Geom.plane(1, 1, 80, "xz");
		this.visible = true;

    const extra = [];
  }

  _init() {}

  render(planeData, lightPos = {}, displacementAmount, intersection = {}) {

		this.rotationX = planeData.rotation.x;
        this.rotationY = planeData.rotation.y;
        this.rotationZ = planeData.rotation.z;

        this.x = planeData.position.x;
        this.y = planeData.position.y;
        this.z = planeData.position.z;

        // this.scale.x = planeData.scale.x;
        // this.scale.z = planeData.scale.z;

				
				this.shader.bind();
					this.shader.uniform("uIntersection", 'vec3', [
							intersection.x !== undefined ? intersection.x : 9999,
							intersection.y !== undefined ? intersection.y : 9999,
							intersection.z !== undefined ? intersection.z : 9999
					]);

					

		this.time += 0.05;
		this.shader.uniform('uTexture', 'uniform1i', 0)
		this.matcapTexture.bind(0)
		
		this.shader.uniform("uTime", "float", this.time);
		
		this.shader.uniform("uSpread", 'float', Config.interaction.spread);
		this.shader.uniform("uShowContact", 'float', Config.interaction.showContact ? 1 : 0);
		this.shader.uniform("uShowLight", 'float', Config.interaction.showLight ? 1 : 0);
		this.shader.uniform("uAmount", 'float', Config.interaction.amount * displacementAmount);
		this.shader.uniform("uScale", 'vec2', [planeData.scale.x, planeData.scale.z]);
		this.shader.uniform("uCameraPos", 'vec3', [planeData.camera.x, planeData.camera.y, planeData.camera.z]);
		this.shader.uniform("uLightWorldPosition", 'vec3', [lightPos.x, lightPos.y, lightPos.z]);
		this.shader.uniform("uNoise", 'vec2', [Config.noise.value, Config.noise.scale]);
		this.shader.uniform("uFadeEdge", 'vec2', [planeData.fadeX || 0, planeData.fadeZ || 0]);

		const speeds = [0, 0, 0, 0];
		const offsets = [0, 0, 0, 0];
    for (let i = 0; i < planeData.waves.length; i++) {
      const wave = planeData.waves[i];
			speeds[i] = wave.speed;
			offsets[i] = wave.offset;
      this.shader.uniform(`uWave${i + 1}`, "vec4", [
        wave.directionX,
        wave.directionY,
        wave.steepness,
        wave.waveLength,
      ]);
    }
    this.shader.uniform("uSpeed", "vec4", speeds);
    this.shader.uniform("uOffset", "vec4", offsets);

    GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }
}

export default ViewPlane;
