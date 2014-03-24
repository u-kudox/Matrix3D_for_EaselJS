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
		multiplication.call(this, this, lhs);
	};

	/**
	*
	* @method prepend
	* @param rhs {Matrix3D}
	* @example
	* <pre><code></code></pre>
	**/
	p.prepend = function(rhs) {
		multiplication.call(this, rhs, this);
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
