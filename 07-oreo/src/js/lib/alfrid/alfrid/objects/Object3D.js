// Object3D.js

import { mat4, quat, vec3 } from 'gl-matrix';

import Scheduler from 'scheduling';
// import { makeRotationFromQuaternion } from 'helpers/Quaternion';
// import { setFromRotationMatrix } from 'utils';

const rotQuat = quat.create();
class Object3D {

	constructor() {
		this._needUpdate = true;

		this._x = 0;
		this._y = 0;
		this._z = 0;

		this._sx = 1;
		this._sy = 1;
		this._sz = 1;

		this._rx = 0;
		this._ry = 0;
		this._rz = 0;

		this._ax = 0;
		this._ay = 0;
		this._az = 0;
		
		this._position = vec3.create();
		this._scale = vec3.fromValues(1, 1, 1);
		this._rotation = vec3.create();
		this._anchor = vec3.create();
		this._anchorNegative = vec3.create();

		this._matrix = mat4.create();
		this._matrixParent = mat4.create();
		this._matrixRotation = mat4.create();
		this._matrixScale = mat4.create();
		this._matrixTranslation = mat4.create();
		this._matrixQuaternion = mat4.create();
		this._quat = quat.create();

		this._children = [];
	}


	addChild(mChild) {
		this._children.push(mChild);
	}


	removeChild(mChild) {
		const index = this._children.indexOf(mChild);
		if(index == -1) {	console.warn('Child no exist'); return;	}

		this._children.splice(index, 1);
	}


	_update() {
		if(!this._needUpdate) { return; }
		
		vec3.set(this._scale, this._sx, this._sy, this._sz);
		vec3.set(this._rotation, this._rx, this._ry, this._rz);
		vec3.set(this._position, this._x, this._y, this._z);
		vec3.set(this._anchor, this._ax, this._ay, this._az);
	  vec3.set(this._anchorNegative, -this._ax, -this._ay, -this._az);

		mat4.identity(this._matrixTranslation, this._matrixTranslation);
		mat4.identity(this._matrixScale, this._matrixScale);
		mat4.identity(this._matrixRotation, this._matrixRotation);

		mat4.translate(this._matrixRotation, this._matrixRotation, this._anchor);
		mat4.rotateX(this._matrixRotation, this._matrixRotation, this._rx);
		mat4.rotateY(this._matrixRotation, this._matrixRotation, this._ry);
		mat4.rotateZ(this._matrixRotation, this._matrixRotation, this._rz);
		mat4.translate(this._matrixRotation, this._matrixRotation, this._anchorNegative);
		

		mat4.fromQuat(this._matrixQuaternion, this._quat);
		mat4.mul(this._matrixRotation, this._matrixQuaternion, this._matrixRotation);

		mat4.scale(this._matrixScale, this._matrixScale, this._scale);
		mat4.translate(this._matrixTranslation, this._matrixTranslation, this._position);

		mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation);
		mat4.mul(this._matrix, this._matrix, this._matrixScale);
		// mat4.mul(this._matrix, this._matrix, this._matrixParent);
		mat4.mul(this._matrix, this._matrixParent, this._matrix);

		this.updateMatrix();

		this._needUpdate = false;
	}

	setParentMatrix(mParentMatrix) {
		if (mParentMatrix) {
			mat4.copy(this._matrixParent, mParentMatrix);
		} else {
			mat4.identify(this._matrixParent);
		}
	}

	updateMatrix(mParentMatrix) {
		if(mParentMatrix) {
			this._needUpdate = true;
			mat4.copy(this._matrixParent, mParentMatrix);
		}

		if(!this._needUpdate) {	return;	}

		this._children.forEach(child => {
			child.updateMatrix(this._matrix);
		});
	}

	setRotationFromQuaternion(mQuat) {
		quat.copy(this._quat, mQuat);
		this._needUpdate = true;
		Scheduler.next(()=>this._update());
	}

	getRotationEuler(matrix, order="XYZ") {
		mat4.getRotation(rotQuat, matrix);
		// const rotationMatrix = makeRotationFromQuaternion(rotQuat);
		// return setFromRotationMatrix(rotationMatrix, order);
	}

	setMatrix(matrix, orderRot="XYZ") {
		mat4.identity(this._matrix);
		mat4.getTranslation(this._position, matrix);
		this._x = this._position[0];
		this._y = this._position[1];
		this._z = this._position[2];
		mat4.getScaling(this._scale, matrix);
		this._sx = this._scale[0];
		this._sy = this._scale[1];
		this._sz = this._scale[2];

		const rot = this.getRotationEuler(matrix, orderRot);		
		this._rx = rot[0];
		this._ry = rot[1];
		this._rz = rot[2];
		this._needUpdate = true;
	}


	get matrix() {
		if(this._needUpdate) {	
			this._update();	
		}
		return this._matrix;
	}

	get x() {	return this._x;	}
	set x(mValue) {
		this._needUpdate = true;
		this._x = mValue;
		Scheduler.next(()=>this._update());
	}

	get y() {	return this._y;	}
	set y(mValue) {
		this._needUpdate = true;
		this._y = mValue;
		Scheduler.next(()=>this._update());
	}

	get z() {	return this._z;	}
	set z(mValue) {
		this._needUpdate = true;
		this._z = mValue;
		Scheduler.next(()=>this._update());
	}

	
	get scaleX() {	return this._sx;	}
	set scaleX(mValue) {
		this._needUpdate = true;
		this._sx = mValue;
		Scheduler.next(()=>this._update());
	}

	get scaleY() {	return this._sy;	}
	set scaleY(mValue) {
		this._needUpdate = true;
		this._sy = mValue;
		Scheduler.next(()=>this._update());
	}

	get scaleZ() {	return this._sz;	}
	set scaleZ(mValue) {
		this._needUpdate = true;
		this._sz = mValue;
		Scheduler.next(()=>this._update());
	}


	get rotationX() {	return this._rx;	}
	set rotationX(mValue) {
		this._needUpdate = true;
		this._rx = mValue;
		Scheduler.next(()=>this._update());
	}

	get rotationY() {	return this._ry;	}
	set rotationY(mValue) {
		this._needUpdate = true;
		this._ry = mValue;
		Scheduler.next(()=>this._update());
	}

	get rotationZ() {	return this._rz;	}
	set rotationZ(mValue) {
		this._needUpdate = true;
		this._rz = mValue;
		Scheduler.next(()=>this._update());
	}

	get anchorX() {	return this._ax;	}
	set anchorX(mValue) {
	  this._needUpdate = true;
	  this._ax = mValue;
	  Scheduler.next(() => this._update());
	}

	get anchorY() {	return this._ay;	}
	set anchorY(mValue) {
	  this._needUpdate = true;
	  this._ay = mValue;
	  Scheduler.next(() => this._update());
	}

	get anchorZ() {	return this._az;	}
	set anchorZ(mValue) {
	  this._needUpdate = true;
	  this._az = mValue;
	  Scheduler.next(() => this._update());
	}

	get children() {	return this._children;	}
}


export default Object3D;