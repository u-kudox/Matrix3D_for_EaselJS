/**
 * Matrix3D for EaselJS
 * Version: 0.70
 * Contact and bug reports : http://kudox.jp/contact or http://twitter.com/u_kudox
 * License : public domain
 **/

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
			this.rawData = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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
			var m33m44_m43m34 = m33 * m44 - m43 * m34,
			    m23m44_m43m24 = m23 * m44 - m43 * m24,
			    m23m34_m33m24 = m23 * m34 - m33 * m24,
			    m31m42_m41m32 = m31 * m42 - m41 * m32,
			    m21m42_m41m22 = m21 * m42 - m41 * m22,
			    m21m32_m31m22 = m21 * m32 - m31 * m22;
			var det = m11 * (m22 * m33m44_m43m34 - m32 * m23m44_m43m24 + m42 * m23m34_m33m24) -
			          m12 * (m21 * m33m44_m43m34 - m31 * m23m44_m43m24 + m41 * m23m34_m33m24) +
			          m13 * (m24 * m31m42_m41m32 - m34 * m21m42_m41m22 + m44 * m21m32_m31m22) -
			          m14 * (m23 * m31m42_m41m32 - m33 * m21m42_m41m22 + m43 * m21m32_m31m22);
			return det;
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
	p.rawData = null;

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
	* @method appendRotation
	* @param degrees {Number}
	* @param axis {Vector3D}
	* @param [pivotPoint=null] {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.appendRotation = function(degrees, axis, pivotPoint) {
		var tx, ty, tz;
		tx = ty = tz = 0;
		if (pivotPoint instanceof createjs.Vector3D) {
			tx = pivotPoint.x;
			ty = pivotPoint.y;
			tz = pivotPoint.z;
		}
		var radian = degrees * Matrix3D.DEG_TO_RAD;
		var cos = Math.cos(radian);
		var sin = Math.sin(radian);
		var x = axis.x;
		var y = axis.y;
		var z = axis.z;
		var x2 = x * x;
		var y2 = y * y;
		var z2 = z * z;
		var ls = x2 + y2 + z2;
		if (ls !== 0) {
			var l = Math.sqrt(ls);
			x /= l;
			y /= l;
			z /= l;
			x2 /= ls;
			y2 /= ls;
			z2 /= ls;
		}
		var ccos = 1 - cos;
		var m = new Matrix3D();
		var d = m.rawData;
		d[0]  = x2 + (y2 + z2) * cos;
		d[1]  = x * y * ccos + z * sin;
		d[2]  = x * z * ccos - y * sin;
		d[4]  = x * y * ccos - z * sin;
		d[5]  = y2 + (x2 + z2) * cos;
		d[6]  = y * z * ccos + x * sin;
		d[8]  = x * z * ccos + y * sin;
		d[9]  = y * z * ccos - x * sin;
		d[10] = z2 + (x2 + y2) * cos;
		d[12] = (tx * (y2 + z2) - x * (ty * y + tz * z)) * ccos + (ty * z - tz * y) * sin;
		d[13] = (ty * (x2 + z2) - y * (tx * x + tz * z)) * ccos + (tz * x - tx * z) * sin;
		d[14] = (tz * (x2 + y2) - z * (tx * x + ty * y)) * ccos + (tx * y - ty * x) * sin;
		this.append(m);
	};

	/**
	*
	* @method appendScale
	* @param xScale {Number}
	* @param [yScale=NaN] {Number}
	* @param [zScale=NaN] {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.appendScale = function(xScale, yScale, zScale) {
		var d = this.rawData;
		if (!isNaN(xScale) && xScale !== 1) {
			d[0]  *= xScale;
			d[4]  *= xScale;
			d[8]  *= xScale;
			d[12] *= xScale;
		}
		if (!isNaN(yScale) && yScale !== 1) {
			d[1]  *= yScale;
			d[5]  *= yScale;
			d[9]  *= yScale;
			d[13] *= yScale;
		}
		if (!isNaN(zScale) && zScale !== 1) {
			d[2]  *= zScale;
			d[6]  *= zScale;
			d[10] *= zScale;
			d[14] *= zScale;
		}
	};

	/**
	*
	* @method appendTranslation
	* @param x {Number}
	* @param [y=0] {Number}
	* @param [z=0] {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.appendTranslation = function(x, y, z) {
		x = x || 0;
		y = y || 0;
		z = z || 0;
		var d = this.rawData;
		var m41 = d[3], m42 = d[7], m43 = d[11], m44 = d[15];
		if (x !== 0) {
			d[0]  += x * m41;
			d[4]  += x * m42;
			d[8]  += x * m43;
			d[12] += x * m44;
		}
		if (y !== 0) {
			d[1]  += y * m41;
			d[5]  += y * m42;
			d[9]  += y * m43;
			d[13] += y * m44;
		}
		if (z !== 0) {
			d[2]  += z * m41;
			d[6]  += z * m42;
			d[10] += z * m43;
			d[14] += z * m44;
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
	* @method copyFrom
	* @param sourceMatrix3D {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyFrom = function(sourceMatrix3D) {
		var d = this.rawData;
		var s = sourceMatrix3D.rawData;
		for (var i = 0; i < 16; i++) {
			d[i] = s[i];
		}
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
	* @method copyToMatrix3D
	* @param dest {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.copyToMatrix3D = function(dest) {
		var d = dest.rawData;
		var s = this.rawData;
		for (var i = 0; i < 16; i++) {
			d[i] = s[i];
		}
	};

	/**
	*
	* @method decompose
	* @param [orientationStyle="eulerAngles"] {String}
	* @return {Array}
	* @example
	* <pre><code></code></pre>
	**/
	p.decompose = function(orientationStyle) {
		var o3D = Orientation3D;
		var eulerAngles = o3D.EULER_ANGLES;
		var quaternion = o3D.QUATERNION;
		var axisAngle = o3D.AXIS_ANGLE;
		orientationStyle = orientationStyle || eulerAngles;
		if (orientationStyle !== eulerAngles && orientationStyle !== quaternion && orientationStyle !== axisAngle) {
			throw new Error("The 1st parameter is invalid.");
		}
		var d = this.rawData;
		var vTranslate = new createjs.Vector3D(d[12], d[13], d[14]);
		var d11 = d[0], d12 = d[4], d13 = d[8],
		    d21 = d[1], d22 = d[5], d23 = d[9],
		    d31 = d[2], d32 = d[6], d33 = d[10];
		var scaleX = Math.sqrt(d11 * d11 + d21 * d21 + d31 * d31);
		var scaleY = Math.sqrt(d12 * d12 + d22 * d22 + d32 * d32);
		var scaleZ = Math.sqrt(d13 * d13 + d23 * d23 + d33 * d33);
		var vScale = new createjs.Vector3D(scaleX, scaleY, scaleZ);
		if (0 < scaleX) {
			d11 /= scaleX;
			d21 /= scaleX;
			d31 /= scaleX;
		}
		if (0 < scaleY) {
			d12 /= scaleY;
			d22 /= scaleY;
			d32 /= scaleY;
		}
		if (0 < scaleZ) {
			d13 /= scaleZ;
			d23 /= scaleZ;
			d33 /= scaleZ;
		}
		var vAngle;
		if (orientationStyle === eulerAngles) {
			var radianX, radianY, radianZ;
			var md31 = -d31;
			if (md31 <= -1) {
				radianY = -Math.PI * 0.5;
			} else if (1 <= md31) {
				radianY = Math.PI * 0.5;
			} else {
				radianY = Math.asin(md31);
			}
			var cosY = Math.cos(radianY);
			if (cosY <= 0.001) {
				radianZ = 0;
				radianX = Math.atan2(-d23, d22);
			} else {
				radianZ = Math.atan2(d21, d11);
				radianX = Math.atan2(d32, d33);
			}
			vAngle = new createjs.Vector3D(radianX, radianY, radianZ);
		} else {
			var traces = [d11 + d22 + d33, d11 - d22 - d33, d22 - d11 - d33, d33 - d11 - d22];
			var traceIndex = traces.indexOf(Math.max.apply(null, traces));
			var traceValue = Math.sqrt(traces[traceIndex] + 1) * 0.5;
			var m = 0.25 / traceValue;
			var x, y, z, w;
			switch (traceIndex) {
				case 0 :
					x = (d32 - d23) * m;
					y = (d13 - d31) * m;
					z = (d21 - d12) * m;
					w = traceValue;
					break;
				case 1 :
					x = traceValue;
					y = (d21 + d12) * m;
					z = (d13 + d31) * m;
					w = (d32 - d23) * m;
					break;
				case 2 :
					x = (d21 + d12) * m;
					y = traceValue;
					z = (d32 + d23) * m;
					w = (d13 - d31) * m;
					break;
				case 3 :
					x = (d13 + d31) * m;
					y = (d32 + d23) * m;
					z = traceValue;
					w = (d21 - d12) * m;
					break;
			}
			var length = Math.sqrt(x * x + y * y + z * z + w * w);
			if (length !== 0) {
				x /= length;
				y /= length;
				z /= length;
				w /= length;
			}
			if (orientationStyle === axisAngle) {
				var t = Math.acos(w);
				var st = Math.sin(t);
				if (st !== 0) {
					x /= st;
					y /= st;
					z /= st;
					w = t * 2;
				} else {
					x = y = z = w = 0;
				}
			}
			vAngle = new createjs.Vector3D(x, y, z, w);
		}
		return [vTranslate, vAngle, vScale];
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
	* @method identity
	* @example
	* <pre><code></code></pre>
	**/
	p.identity = function() {
		var d = this.rawData;
		d[0] = d[5] = d[10] = d[15] = 1;
		d[1] = d[2] = d[3] = d[4] = d[6] = d[7] = d[8] = d[9] = d[11] = d[12] = d[13] = d[14] = 0;
	};

	/**
	*
	* @method invert
	* @return Boolean
	* @example
	* <pre><code></code></pre>
	**/
	p.invert = function() {
		var rd = this.rawData;
		var m11 = rd[0],  m12 = rd[4],  m13 = rd[8],  m14 = rd[12],
		    m21 = rd[1],  m22 = rd[5],  m23 = rd[9],  m24 = rd[13],
		    m31 = rd[2],  m32 = rd[6],  m33 = rd[10], m34 = rd[14],
		    m41 = rd[3],  m42 = rd[7],  m43 = rd[11], m44 = rd[15];
		var m33m44_m43m34 = m33 * m44 - m43 * m34,
		    m23m44_m43m24 = m23 * m44 - m43 * m24,
		    m23m34_m33m24 = m23 * m34 - m33 * m24,
		    m31m42_m41m32 = m31 * m42 - m41 * m32,
		    m21m42_m41m22 = m21 * m42 - m41 * m22,
		    m21m32_m31m22 = m21 * m32 - m31 * m22;
		var det = m11 * (m22 * m33m44_m43m34 - m32 * m23m44_m43m24 + m42 * m23m34_m33m24) -
		          m12 * (m21 * m33m44_m43m34 - m31 * m23m44_m43m24 + m41 * m23m34_m33m24) +
		          m13 * (m24 * m31m42_m41m32 - m34 * m21m42_m41m22 + m44 * m21m32_m31m22) -
		          m14 * (m23 * m31m42_m41m32 - m33 * m21m42_m41m22 + m43 * m21m32_m31m22);
		if (det === 0) {
			return false;
		}
		var ad = 1 / det;
		var m13m44_m43m14 = m13 * m44 - m43 * m14,
		    m13m34_m33m14 = m13 * m34 - m33 * m14,
		    m11m42_m41m12 = m11 * m42 - m41 * m12,
		    m11m32_m31m12 = m11 * m32 - m31 * m12,
		    m13m24_m23m14 = m13 * m24 - m23 * m14,
		    m11m22_m21m12 = m11 * m22 - m21 * m12;
		rd[0]  = (m22 * (m33m44_m43m34) - m32 * (m23m44_m43m24) + m42 * (m23m34_m33m24)) * ad;
		rd[1]  = (m21 * (m33m44_m43m34) - m31 * (m23m44_m43m24) + m41 * (m23m34_m33m24)) * -ad;
		rd[2]  = (m24 * (m31m42_m41m32) - m34 * (m21m42_m41m22) + m44 * (m21m32_m31m22)) * ad;
		rd[3]  = (m23 * (m31m42_m41m32) - m33 * (m21m42_m41m22) + m43 * (m21m32_m31m22)) * -ad;
		rd[4]  = (m12 * (m33m44_m43m34) - m32 * (m13m44_m43m14) + m42 * (m13m34_m33m14)) * -ad;
		rd[5]  = (m11 * (m33m44_m43m34) - m31 * (m13m44_m43m14) + m41 * (m13m34_m33m14)) * ad;
		rd[6]  = (m14 * (m31m42_m41m32) - m34 * (m11m42_m41m12) + m44 * (m11m32_m31m12)) * -ad;
		rd[7]  = (m13 * (m31m42_m41m32) - m33 * (m11m42_m41m12) + m43 * (m11m32_m31m12)) * ad;
		rd[8]  = (m12 * (m23m44_m43m24) - m22 * (m13m44_m43m14) + m42 * (m13m24_m23m14)) * ad;
		rd[9]  = (m11 * (m23m44_m43m24) - m21 * (m13m44_m43m14) + m41 * (m13m24_m23m14)) * -ad;
		rd[10] = (m14 * (m21m42_m41m22) - m24 * (m11m42_m41m12) + m44 * (m11m22_m21m12)) * ad;
		rd[11] = (m13 * (m21m42_m41m22) - m23 * (m11m42_m41m12) + m43 * (m11m22_m21m12)) * -ad;
		rd[12] = (m12 * (m23m34_m33m24) - m22 * (m13m34_m33m14) + m32 * (m13m24_m23m14)) * -ad;
		rd[13] = (m11 * (m23m34_m33m24) - m21 * (m13m34_m33m14) + m31 * (m13m24_m23m14)) * ad;
		rd[14] = (m14 * (m21m32_m31m22) - m24 * (m11m32_m31m12) + m34 * (m11m22_m21m12)) * -ad;
		rd[15] = (m13 * (m21m32_m31m22) - m23 * (m11m32_m31m12) + m33 * (m11m22_m21m12)) * ad;
		return true;
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
	* @method prependRotation
	* @param degrees {Number}
	* @param axis {Vector3D}
	* @param [pivotPoint=null] {Vector3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.prependRotation = function(degrees, axis, pivotPoint) {
		var tx, ty, tz;
		tx = ty = tz = 0;
		if (pivotPoint instanceof createjs.Vector3D) {
			tx = pivotPoint.x;
			ty = pivotPoint.y;
			tz = pivotPoint.z;
		}
		var radian = degrees * Matrix3D.DEG_TO_RAD;
		var cos = Math.cos(radian);
		var sin = Math.sin(radian);
		var x = axis.x;
		var y = axis.y;
		var z = axis.z;
		var x2 = x * x;
		var y2 = y * y;
		var z2 = z * z;
		var ls = x2 + y2 + z2;
		if (ls !== 0) {
			var l = Math.sqrt(ls);
			x /= l;
			y /= l;
			z /= l;
			x2 /= ls;
			y2 /= ls;
			z2 /= ls;
		}
		var ccos = 1 - cos;
		var m = new Matrix3D();
		var d = m.rawData;
		d[0]  = x2 + (y2 + z2) * cos;
		d[1]  = x * y * ccos + z * sin;
		d[2]  = x * z * ccos - y * sin;
		d[4]  = x * y * ccos - z * sin;
		d[5]  = y2 + (x2 + z2) * cos;
		d[6]  = y * z * ccos + x * sin;
		d[8]  = x * z * ccos + y * sin;
		d[9]  = y * z * ccos - x * sin;
		d[10] = z2 + (x2 + y2) * cos;
		d[12] = (tx * (y2 + z2) - x * (ty * y + tz * z)) * ccos + (ty * z - tz * y) * sin;
		d[13] = (ty * (x2 + z2) - y * (tx * x + tz * z)) * ccos + (tz * x - tx * z) * sin;
		d[14] = (tz * (x2 + y2) - z * (tx * x + ty * y)) * ccos + (tx * y - ty * x) * sin;
		this.prepend(m);
	};

	/**
	*
	* @method prependScale
	* @param xScale {Number}
	* @param [yScale=NaN] {Number}
	* @param [zScale=NaN] {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.prependScale = function(xScale, yScale, zScale) {
		var d = this.rawData;
		if (!isNaN(xScale) && xScale !== 1) {
			d[0]  *= xScale;
			d[1]  *= xScale;
			d[2]  *= xScale;
			d[3]  *= xScale;
		}
		if (!isNaN(yScale) && yScale !== 1) {
			d[4]  *= yScale;
			d[5]  *= yScale;
			d[6]  *= yScale;
			d[7]  *= yScale;
		}
		if (!isNaN(zScale) && zScale !== 1) {
			d[8]  *= zScale;
			d[9]  *= zScale;
			d[10] *= zScale;
			d[11] *= zScale;
		}
	};

	/**
	*
	* @method prependTranslation
	* @param x {Number}
	* @param [y=0] {Number}
	* @param [z=0] {Number}
	* @example
	* <pre><code></code></pre>
	**/
	p.prependTranslation = function(x, y, z) {
		x = x || 0;
		y = y || 0;
		z = z || 0;
		var d = this.rawData;
		var m11 = d[0],  m12 = d[4],  m13 = d[8],  m14 = d[12],
		    m21 = d[1],  m22 = d[5],  m23 = d[9],  m24 = d[13],
		    m31 = d[2],  m32 = d[6],  m33 = d[10], m34 = d[14],
		    m41 = d[3],  m42 = d[7],  m43 = d[11], m44 = d[15];
		d[12] += m11 * x + m12 * y + m13 * z;
		d[13] += m21 * x + m22 * y + m23 * z;
		d[14] += m31 * x + m32 * y + m33 * z;
		d[15] += m41 * x + m42 * y + m43 * z;
	};

	/**
	*
	* @method recompose
	* @param components {Array}
	* @param [orientationStyle="eulerAngles"] {String}
	* @return {Boolean}
	* @example
	* <pre><code></code></pre>
	**/
	p.recompose = function(components, orientationStyle) {
		if (!components || components.length < 3) {
			return false;
		} else {
			for (var i = 0; i < 3; i++) {
				if (!(components[i] instanceof createjs.Vector3D)) {
					return false;
				}
			}
		}
		var o3D = Orientation3D;
		var eulerAngles = o3D.EULER_ANGLES;
		var quaternion = o3D.QUATERNION;
		var axisAngle = o3D.AXIS_ANGLE;
		orientationStyle = orientationStyle || eulerAngles;
		if (orientationStyle !== eulerAngles && orientationStyle !== quaternion && orientationStyle !== axisAngle) {
			throw new Error("The 2nd parameter is invalid.");
		}
		var d = this.rawData;
		var vTranslate = components[0];
		d[12] = vTranslate.x;
		d[13] = vTranslate.y;
		d[14] = vTranslate.z;
		var vAngle = components[1];
		var vScale = components[2];
		d[0] = d[1] = d[2] = vScale.x;
		d[4] = d[5] = d[6] = vScale.y;
		d[8] = d[9] = d[10] = vScale.z;
		if (orientationStyle === eulerAngles) {
			var radianX = vAngle.x;
			var cosX = Math.cos(radianX);
			var sinX = Math.sin(radianX);
			var radianY = vAngle.y;
			var cosY = Math.cos(radianY);
			var sinY = Math.sin(radianY);
			var radianZ = vAngle.z;
			var cosZ = Math.cos(radianZ);
			var sinZ = Math.sin(radianZ);
			d[0] *= cosY * cosZ;
			d[1] *= cosY * sinZ;
			d[2] *= -sinY;
			d[4] *= sinX * sinY * cosZ - cosX * sinZ;
			d[5] *= sinX * sinY * sinZ + cosX * cosZ;
			d[6] *= sinX * cosY;
			d[8] *= cosX * sinY * cosZ + sinX * sinZ;
			d[9] *= cosX * sinY * sinZ - sinX * cosZ;
			d[10] *= cosX * cosY;
		} else {
			var x = vAngle.x;
			var y = vAngle.y;
			var z = vAngle.z;
			var w = vAngle.w;
			if (orientationStyle === axisAngle) {
				var hw = w * 0.5;
				var st = Math.sin(hw);
				x *= st;
				y *= st;
				z *= st;
				w = Math.cos(hw);
			}
			d[0] *= 1 - 2 * (y * y + z * z);
			d[1] *= 2 * (x * y + z * w);
			d[2] *= 2 * (x * z - y * w);
			d[4] *= 2 * (x * y - z * w);
			d[5] *= 1 - 2 * (x * x + z * z);
			d[6] *= 2 * (y * z + x * w);
			d[8] *= 2 * (x * z + y * w);
			d[9] *= 2 * (y * z - x * w);
			d[10] *= 1 - 2 * (x * x + y * y);
		}
		return true;
	};

	/**
	*
	* @method toString
	* @return {String}
	**/
	p.toString = function() {
		return "[Matrix3D [" + Array.prototype.slice.call(this.rawData).toString() + "]]";
	};

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
	* @static
	* @property DEG_TO_RAD
	* @type {Number}
	* @default Math.PI / 180
	**/
	s.DEG_TO_RAD = Math.PI / 180;

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
		d[0]  = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		d[1]  = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		d[2]  = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		d[3]  = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		d[4]  = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		d[5]  = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		d[6]  = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		d[7]  = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		d[8]  = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		d[9]  = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		d[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		d[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		d[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		d[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		d[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		d[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
	}

	/**
	*
	* @static
	* @class Orientation3D
	**/
	var Orientation3D = {
		/**
		*
		* @static
		* @property AXIS_ANGLE
		* @type String
		* @default "axisAngle"
		**/
		AXIS_ANGLE : "axisAngle",

		/**
		*
		* @static
		* @property EULER_ANGLES
		* @type String
		* @default "eulerAngles"
		**/
		EULER_ANGLES : "eulerAngles",

		/**
		*
		* @static
		* @property QUATERNION
		* @type String
		* @default "quaternion"
		**/
		QUATERNION : "quaternion"
	};

	createjs.Matrix3D = Matrix3D;
	createjs.Orientation3D = Orientation3D;
}(window));
