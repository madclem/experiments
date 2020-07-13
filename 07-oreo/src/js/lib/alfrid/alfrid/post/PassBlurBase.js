// PassBlurBase.js

import GL from '../GLTool';
import Pass from './Pass';
import fsBlur13 from '../shaders/blur13.frag';
import fsBlur5 from '../shaders/blur5.frag';
import fsBlur9 from '../shaders/blur9.frag';

class PassBlurBase extends Pass {
	constructor(mQuality = 9, mDirection, mWidth, mHeight, mParams = {}) {
		let fs;
		switch(mQuality) {
		case 5:
		default:
			fs = fsBlur5;
			break;
		case 9 : 
			fs = fsBlur9;
			break;
		case 13 : 
			fs = fsBlur13;
			break;

		}
		super(fs, mWidth, mHeight, mParams);
		this.uniform('uDirection', mDirection);
		this.uniform('uResolution', [GL.width, GL.height]);
	}
}

export default PassBlurBase;
