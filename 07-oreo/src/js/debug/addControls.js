// addControls.js

import Config from "../Config";
import Settings from "../Settings";
import { saveJson } from "../utils";

const addControls = (scene) => {
  /**
   * a simple function to add a plane to the controls (with waves etc.)
   */
  function addPlaneFolder(p, i) {
    const folderPlane = gui.addFolder(p.label);
    const folderTransform = folderPlane.addFolder("transforms");
    // plane scale
    folderPlane
      .add(p, "visible")
      .name("toggle")
      .onChange(Settings.refresh);
    folderTransform
      .add(p.scale, "x", 0, 40)
      .name("scaleX")
      .step(0.01)
      .onChange(Settings.refresh);
    folderTransform
      .add(p.scale, "z", 0, 40)
      .name("scaleZ")
      .step(0.01)
      .onChange(Settings.refresh);
    // plane rotation
    folderTransform
      .add(p.rotation, "x", -Math.PI * 2, Math.PI * 2)
      .name("rotX")
      .step(0.01)
      .onChange(Settings.refresh);
    folderTransform
      .add(p.rotation, "y", -Math.PI * 2, Math.PI * 2)
      .name("rotY")
      .step(0.01)
      .onChange(Settings.refresh);
    folderTransform
      .add(p.rotation, "z", -Math.PI * 2, Math.PI * 2)
      .name("rotZ")
      .step(0.01)
      .onChange(Settings.refresh);
    // plane position
    folderTransform
      .add(p.position, "x", -20, 20)
      .name("posX")
      .step(0.01)
      .onChange(Settings.refresh);
    folderTransform
      .add(p.position, "y", -20, 20)
      .name("posY")
      .step(0.01)
      .onChange(Settings.refresh);
    folderTransform
      .add(p.position, "z", -20, 20)
      .name("posZ")
      .step(0.01)
      .onChange(Settings.refresh);

    const folderCamera = folderPlane.addFolder("camera");
    folderCamera
      .add(p.camera, "x", -10, 10)
      .step(0.01)
      .onChange(Settings.refresh);
    folderCamera
      .add(p.camera, "y", -10, 10)
      .step(0.01)
      .onChange(Settings.refresh);
    folderCamera
      .add(p.camera, "z", -10, 10)
      .step(0.01)
      .onChange(Settings.refresh);

    // plane waves
    p.waves.forEach((w, k) => {
			const folder = folderPlane.addFolder("wave" + (k + 1));
			console.log(w)
      folder
        .add(w, "speed", -1, 2)
        .step(0.01)
        .onChange(() => {
					console.log('here changes')
					Settings.refresh()
				});
      folder
        .add(w, "waveLength", 0, 50)
        .step(0.01)
        .onChange(Settings.refresh);
      folder
        .add(w, "steepness", 0, 10)
        .step(0.01)
        .onChange(Settings.refresh);
      folder
        .add(w, "offset", -10, 10)
        .step(0.01)
        .onChange(Settings.refresh);
      folder
        .add(w, "directionX", 0, 1)
        .step(0.01)
        .onChange(Settings.refresh);
      folder
        .add(w, "directionY", 0, 1)
        .step(0.01)
        .onChange(Settings.refresh);
    });
  }

  const oControl = {
    saveUrl: () => {
      Settings.refresh();
    },
    toggleOrbital: () => {
      scene.orbitalControl.lock(!scene.orbitalControl._isLockZoom)
    },
    download: () => {
      saveJson(Config, "Settings");
    },
  };

  setTimeout(() => {
    // const fLight = gui.addFolder('point light');
    // fLight
    //     .add(Config.lightWorldPosition, 'x', -100, 100)
    //     .name('light x')
    //     .onChange(Settings.refresh);
    // fLight
    //     .add(Config.lightWorldPosition, 'y', -10, 10)
    //     .name('light y')
    //     .onChange(Settings.refresh);
    // fLight
    //     .add(Config.lightWorldPosition, 'z', -100, 100)
    //     .name('light z')
    //     .onChange(Settings.refresh);

    const fTooth = gui.addFolder("tooth");

    const fToothanchor = fTooth.addFolder('anchor');
    fToothanchor.add(Config.tooth.anchor, 'x', -5, 5, 0.01).onChange(Settings.refresh);
    fToothanchor.add(Config.tooth.anchor, 'y', -5, 5, 0.01).onChange(Settings.refresh);
    fToothanchor.add(Config.tooth.anchor, 'z', -5, 5, 0.01).onChange(Settings.refresh);

    const fToothScale = fTooth.addFolder('scale');
    fToothScale.add(Config.tooth.scale, 'x', 1, 5, 0.01).onChange(()=>{
      Config.tooth.scale.y = Config.tooth.scale.x;
      Config.tooth.scale.z = Config.tooth.scale.x;
      Settings.refresh();
    });
    // fToothScale.add(Config.tooth.scale, 'y', 1, 5, 0.01).onChange(Settings.refresh);
    // fToothScale.add(Config.tooth.scale, 'z', 1, 5, 0.01).onChange(Settings.refresh);

    const fToothPos = fTooth.addFolder('position');
    fToothPos.add(Config.tooth.position, 'x', -5, 5, 0.01).onChange(Settings.refresh);
    fToothPos.add(Config.tooth.position, 'y', -5, 5, 0.01).onChange(Settings.refresh);
    fToothPos.add(Config.tooth.position, 'z', -5, 5, 0.01).onChange(Settings.refresh);

    const fToothRot = fTooth.addFolder('Rotation');
    fToothRot.add(Config.tooth.rotation, 'x', -5, 5, 0.01).onChange(Settings.refresh);
    fToothRot.add(Config.tooth.rotation, 'y', -5, 5, 0.01).onChange(Settings.refresh);
    fToothRot.add(Config.tooth.rotation, 'z', -5, 5, 0.01).onChange(Settings.refresh);

    const fInteraction = gui.addFolder("interaction");
    fInteraction
      .add(Config.interaction, "debug")
      .name("toggle debug")
      .onChange(() => {
        if (!Config.interaction.debug) {
          Config.interaction.showLight = false;
          Config.interaction.showContact = false;
          Config.interaction.showPlanes = false;
        }
        Settings.refresh();
      });
    fInteraction
      .add(Config.interaction, "showPlanes")
      .name("toggle planes")
      .onChange(Settings.refresh);
    fInteraction
      .add(Config.interaction, "showLight")
      .name("debug light")
      .onChange(() => {
        if (Config.interaction.showLight) {
          Config.interaction.showContact = false;
        }

        Settings.refresh();
      });
    fInteraction
      .add(Config.interaction, "showContact")
      .name("debug contact")
      .onChange(() => {
        if (Config.interaction.showContact) {
          Config.interaction.showLight = false;
        }

        Settings.refresh();
      });
    fInteraction
      .add(Config.interaction, "spread", 0, 20)
      .onChange(Settings.refresh);
    fInteraction
      .add(Config.interaction, "amount", 0, 2)
      .onChange(Settings.refresh);

    const fInteractionTransforms = fInteraction.addFolder("transform");
    fInteractionTransforms
      .add(Config.interaction.transform.position, "z", -20, 0)
      .name("pos.z")
      .step(0.01)
      .onChange(Settings.refresh);
    fInteractionTransforms
      .add(Config.interaction.transform.position, "y", -10, 10)
      .name("pos.y")
      .step(0.01)
      .onChange(Settings.refresh);
    fInteractionTransforms
      .add(Config.interaction.transform.rotation, "y", -Math.PI, Math.PI)
      .name("rot.y")
      .step(0.01)
      .onChange(Settings.refresh);
    fInteractionTransforms
      .add(Config.interaction.transform.scale, "x", 5, 50)
      .name("scale.x")
      .step(0.01)
      .onChange(Settings.refresh);
    fInteractionTransforms
      .add(Config.interaction.transform.scale, "y", 5, 50)
      .name("scale.y")
      .step(0.01)
      .onChange(Settings.refresh);

    const fNoise = gui.addFolder("Noise");
    fNoise
      .add(Config.noise, "value", 0, 2)
      .step(0.01)
      .name("noise value")
      .onChange(Settings.refresh);
    fNoise
      .add(Config.noise, "scale", 0, 2)
      .step(0.01)
      .name("noise scale")
      .onChange(Settings.refresh);

    Config.planes.forEach((p, i) => {
      addPlaneFolder(p, i);
    });

    gui.add(oControl, "toggleOrbital").name("Toggle orbital");
    gui.add(oControl, "download").name("Download Settings");
    gui.add(Settings, "reset").name("Reset Default");
  }, 200);
};

export default addControls;
