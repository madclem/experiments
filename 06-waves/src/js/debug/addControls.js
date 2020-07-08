// addControls.js

import Config from '../Config';
import Settings from '../Settings';
import { saveJson } from '../utils';

const addControls = (scene) => {

	const oControl = {
		save:() => {
			saveJson(Config, 'Settings');
		}
	}

	setTimeout(()=> {
		
		Config.waves.forEach((w, i) => {
			const folder = gui.addFolder('wave' + (i + 1));
			folder.add(w, 'speed', -1, 2).onChange(Settings.refresh);
			folder.add(w, 'waveLength', 0, 50).onChange(Settings.refresh);
			folder.add(w, 'steepness', 0, 10).onChange(Settings.refresh);
			folder.add(w, 'directionX', 0, 1).onChange(Settings.refresh);
			folder.add(w, 'directionY', 0, 1).onChange(Settings.refresh);
		});

		gui.add(oControl, 'save').name('Save Settings');
		gui.add(Settings, 'reset').name('Reset Default');
	}, 200);
}


export default addControls;