/**
* @namespace createjs
**/
this.createjs = this.createjs || {};

(function(window) {
	"use strict";

	/**
	*
	* [0],  [4],  [8],  [12]
	* [1],  [5],  [9],  [13]
	* [2],  [6],  [10], [14]
	* [3],  [7],  [11], [15]
	* @class Matrix3D
	* @constructor
	* @param [v=null] {Array}
	* @example
	* <pre><code></code></pre>
	**/
	function Matrix3D(v) {
		if (!!v && v.length === 16) {
			this.rawData = new Float32Array(v);
		} else {
			this.identity();
		}
	}

	var s = Matrix3D;

	var p = Matrix3D.prototype = {
		/**
		* [read only]
		* @property determinant
		* @type Number
		* @readOnly
		**/
		get determinant() {
			var rd = this.rawData;
			var m11 = rd[0],  m12 = rd[4],  m13 = rd[8],  m14 = rd[12],
					m21 = rd[1],  m22 = rd[5],  m23 = rd[9],  m24 = rd[13],
					m31 = rd[2],  m32 = rd[6],  m33 = rd[10], m34 = rd[14],
					m41 = rd[3],  m42 = rd[7],  m43 = rd[11], m44 = rd[15];
			var m33m44 = m33 * m44;
			var m43m24 = m43 * m24;
			var m23m34 = m23 * m34;
			var m43m34 = m43 * m34;
			var m23m44 = m23 * m44;
			var m33m24 = m33 * m24;
			var m21m32 = m21 * m32;
			var m31m42 = m31 * m42;
			var m41m22 = m41 * m22;
			var m21m42 = m21 * m42;
			var m31m22 = m31 * m22;
			var m41m32 = m41 * m32;
			var d1 = m11 * (m22 * m33m44 + m32 * m43m24 + m42 * m23m34 - m22 * m43m34 - m32 * m23m44 - m42 * m33m24);
			var d2 = m12 * (m21 * m33m44 + m31 * m43m24 + m41 * m23m34 - m21 * m43m34 - m31 * m23m44 - m41 * m33m24);
			var d3 = m13 * (m21m32 * m44 + m31m42 * m24 + m41m22 * m34 - m21m42 * m34 - m31m22 * m44 - m41m32 * m24);
			var d4 = m14 * (m21m32 * m43 + m31m42 * m23 + m41m22 * m33 - m21m42 * m33 - m31m22 * m43 - m41m32 * m23);
			return d1 - d2 + d3 - d4;
		},

		/**
		*
		* @property position
		* @type Vector3D
		**/
		get position() {
			var d = this.rawData;
			return new createjs.Vector3D(d[12], d[13], d[14]);
		},
		set position(value) {
			var d = this.rawData;
			d[12] = value.x;
			d[13] = value.y;
			d[14] = value.z;
		}
	};

	/**
	*
	* @property rawData
	* @type Float32Array
	**/
	p.rawData;

	/**
	*
	* @method identity
	* @example
	* <pre><code></code></pre>
	**/
	p.identity = function() {
		this.rawData = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	};

	/**
	*
	* @method append
	* @param lhs {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.append = function(lhs) {
		multiplication.call(this, lhs, this);
	};

	/**
	*
	* @method prepend
	* @param rhs {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.prepend = function(rhs) {
		multiplication.call(this, this, rhs);
	};

	/**
	*
	* @method appendTranslation
	* @param x {Number}
	* @param y {Number}
	* @param z {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.appendTranslation = function(x, y, z) {
		this.append(new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]));
	};

	/**
	*
	* @method prependTranslation
	* @param x {Number}
	* @param y {Number}
	* @param z {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.prependTranslation = function(x, y, z) {
		this.prepend(new Matrix3D([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]));
	};

	/**
	*
	* @method appendScale
	* @param xScale {Number}
	* @param yScale {Number}
	* @param zScale {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.appendScale = function(xScale, yScale, zScale) {
		this.append(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
	};

	/**
	*
	* @method prependScale
	* @param xScale {Number}
	* @param yScale {Number}
	* @param zScale {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.prependScale = function(xScale, yScale, zScale) {
		this.prepend(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
	};

	/**
	*
	* @method appendRotation
	* @param degrees {Number}
	* @param axis {Vector3D}
	* @param [pivotPoint=null] {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	/*
	p.appendRotation = function(degrees, axis, pivotPoint) {
		var tx, ty, tz;
		tx = ty = tz = 0;
		if (pivotPoint instanceof createjs.Vector3D) {
			tx = pivotPoint.x;
			ty = pivotPoint.y;
			tz = pivotPoint.z;
		}
		var radian = degrees * createjs.Matrix2D.DEG_TO_RAD;
		var cos = Math.cos(radian);
		var sin = Math.sin(radian);
		if (axis.equals(createjs.Vector3D.X_AXIS)) {
			this.append(new Matrix3D([1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, tx, ty, tz, 1]));
		} else if (axis.equals(createjs.Vector3D.Y_AXIS)) {
			this.append(new Matrix3D([cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, tx, ty, tz, 1]));
		} else if (axis.equals(createjs.Vector3D.Z_AXIS)) {
			this.append(new Matrix3D([cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]));
		}
	};
	*/

	/**
	*
	* @method prependRotation
	* @param degrees {Number}
	* @param axis {Vector3D}
	* @param [pivotPoint=null] {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	/*
	p.prependRotation = function(degrees, axis, pivotPoint) {
		var tx, ty, tz;
		tx = ty = tz = 0;
		if (pivotPoint instanceof createjs.Vector3D) {
			tx = pivotPoint.x;
			ty = pivotPoint.y;
			tz = pivotPoint.z;
		}
		var radian = degrees * createjs.Matrix2D.DEG_TO_RAD;
		var cos = Math.cos(radian);
		var sin = Math.sin(radian);
		if (axis.equals(createjs.Vector3D.X_AXIS)) {
			this.prepend(new Matrix3D([1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, tx, ty, tz, 1]));
		} else if (axis.equals(createjs.Vector3D.Y_AXIS)) {
			this.prepend(new Matrix3D([cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, tx, ty, tz, 1]));
		} else if (axis.equals(createjs.Vector3D.Z_AXIS)) {
			this.prepend(new Matrix3D([cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]));
		}
	};
	*/

	/**
	*
	* @method transformVector
	* @param v {Vector3D}
	* @return {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.transformVector = function(v) {
		var vx = v.x;
		var vy = v.y;
		var vz = v.z;
		var d = this.rawData;
		var x = d[0] * vx + d[4] * vy + d[8] * vz + d[12];
		var y = d[1] * vx + d[5] * vy + d[9] * vz + d[13];
		var z = d[2] * vx + d[6] * vy + d[10] * vz + d[14];
		return new createjs.Vector3D(x, y, z, 1);
	};

	/**
	*
	* @method deltaTransformVector
	* @param v {Vector3D}
	* @return {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.deltaTransformVector = function(v) {
		var vx = v.x;
		var vy = v.y;
		var vz = v.z;
		var d = this.rawData;
		var x = d[0] * vx + d[4] * vy + d[8] * vz;
		var y = d[1] * vx + d[5] * vy + d[9] * vz;
		var z = d[2] * vx + d[6] * vy + d[10] * vz;
		return new createjs.Vector3D(x, y, z);
	};

	/**
	*
	* @method transformVectors
	* @param vin {Array}
	* @param vout {Array}
	* @example
	* <pre><code></code></pre>
	**/
	p.transformVectors = function(vin, vout) {
		var d = this.rawData;
		var d11 = d[0],  d12 = d[4],  d13 = d[8],  d14 = d[12],
				d21 = d[1],  d22 = d[5],  d23 = d[9],  d24 = d[13],
				d31 = d[2],  d32 = d[6],  d33 = d[10], d34 = d[14];

		var x, y, z;
		for (var i = 0, l = vin.length; i < l; i += 3) {
			var j = i + 1;
			var k = i + 2;
			x = vin[i];
			y = vin[j];
			z = vin[k];
			vout[i] = d11 * x + d12 * y + d13 * z + d14;
			vout[j] = d21 * x + d22 * y + d23 * z + d24;
			vout[k] = d31 * x + d32 * y + d33 * z + d34;
		}
	};

	/**
	*
	* @method copyFrom
	* @param sourceMatrix3D {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyFrom = function(sourceMatrix3D) {
		this.rawData = new Float32Array(sourceMatrix3D.rawData);
	};

	/**
	*
	* @method copyToMatrix3D
	* @param dest {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyToMatrix3D = function(dest) {
		dest.rawData = new Float32Array(this.rawData);
	};

	/**
	*
	* @method copyColumnFrom
	* @param column {uint}
	* @param vector3D {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyColumnFrom = function(column, vector3D) {
		column = column | 0;
		if (column < 0 || 3 < column) {
			return;
		}
		var i = column * 4;
		var d = this.rawData;
		d[i] = vector3D.x;
		d[++i] = vector3D.y;
		d[++i] = vector3D.z;
		d[++i] = vector3D.w;
	};

	/**
	*
	* @method copyColumnTo
	* @param column {uint}
	* @param vector3D {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyColumnTo = function(column, vector3D) {
		column = column | 0;
		if (column < 0 || 3 < column) {
			return;
		}
		var i = column * 4;
		var d = this.rawData;
		vector3D.x = d[i];
		vector3D.y = d[++i];
		vector3D.z = d[++i];
		vector3D.w = d[++i];
	};

	/**
	*
	* @method copyRowFrom
	* @param row {uint}
	* @param vector3D {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyRowFrom = function(row, vector3D) {
		row = row | 0;
		if (row < 0 || 3 < row) {
			return;
		}
		var d = this.rawData;
		d[row] = vector3D.x;
		d[row += 4] = vector3D.y;
		d[row += 4] = vector3D.z;
		d[row += 4] = vector3D.w;
	};

	/**
	*
	* @method copyRowTo
	* @param row {uint}
	* @param vector3D {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyRowTo = function(row, vector3D) {
		row = row | 0;
		if (row < 0 || 3 < row) {
			return;
		}
		var d = this.rawData;
		vector3D.x = d[row];
		vector3D.y = d[row += 4];
		vector3D.z = d[row += 4];
		vector3D.w = d[row += 4];
	};

	/**
	*
	* @method copyRawDataFrom
	* @param array {Array}
	* @param [index=0] {uint}
	* @param [transpose=false] {Boolean}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyRawDataFrom = function(array, index, transpose) {
		index = index | 0;
		var length = array.length;
		if (index < 0 || (length - index) < 16) {
			throw new Error('Invalid parameter');
		}
		var d = this.rawData;
		for (var i = 0; i < 16; i++) {
			d[i] = array[index++];
		}
		if (transpose) this.transpose();
	};

	/**
	*
	* @method copyRawDataTo
	* @param array {Array}
	* @param [index=0] {uint}
	* @param [transpose=false] {Boolean}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyRawDataTo = function(array, index, transpose) {
		index = index | 0;
		if (index < 0) {
			throw new Error("Invalid parameter");
		}
		var d;
		if (transpose) {
			var tm = this.clone();
			tm.transpose();
			d = tm.rawData;
		} else {
			d = this.rawData;
		}
		for (var i = 0; i < 16; i++) {
			array[index++] = d[i];
		}
	};

	/**
	*
	* @method transpose
	* @example
	* <pre><code></code></pre>
	**/
	p.transpose = function() {
		var d = this.rawData;
		this.rawData = new Float32Array([d[0], d[4], d[8], d[12], d[1], d[5], d[9], d[13], d[2], d[6], d[10], d[14], d[3], d[7], d[11], d[15]]);
	};

	/**
	*
	* @method invert
	* @return Boolean
	* @example
	* <pre><code></code></pre>
	**/
	p.invert = function() {
		var det = this.determinant;
		if (det === 0) {
			return false;
		}
	};


	/**
	*
	* @method clone
	* @return {Matrix3D}
	**/
	p.clone = function() {
		return new Matrix3D(this.rawData);
	};

	/**
	*
	* @method toString
	* @return {String}
	**/
	p.toString = function() {
		return "[Matrix3D [" + Array.prototype.slice.call(this.rawData).toString() + "]]";
	};










	function multiplication(m1, m2) {
		var rd1 = m1.rawData;
		var a11 = rd1[0],  a12 = rd1[4],  a13 = rd1[8],  a14 = rd1[12],
				a21 = rd1[1],  a22 = rd1[5],  a23 = rd1[9],  a24 = rd1[13],
				a31 = rd1[2],  a32 = rd1[6],  a33 = rd1[10], a34 = rd1[14],
				a41 = rd1[3],  a42 = rd1[7],  a43 = rd1[11], a44 = rd1[15];
		var rd2 = m2.rawData;
		var b11 = rd2[0],  b12 = rd2[4],  b13 = rd2[8],  b14 = rd2[12],
				b21 = rd2[1],  b22 = rd2[5],  b23 = rd2[9],  b24 = rd2[13],
				b31 = rd2[2],  b32 = rd2[6],  b33 = rd2[10], b34 = rd2[14],
				b41 = rd2[3],  b42 = rd2[7],  b43 = rd2[11], b44 = rd2[15];
		var d = this.rawData;
		d[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		d[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		d[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		d[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		d[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		d[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		d[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		d[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		d[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		d[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		d[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		d[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		d[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		d[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		d[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		d[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
	}

	createjs.Matrix3D = Matrix3D;
}(window));
