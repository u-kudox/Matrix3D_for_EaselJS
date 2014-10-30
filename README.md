# Matrix3D for EaselJS

Matrix3D for EaselJS adds AS3 like Matrix3D class to EaselJS.
You can use [Vector3D for EaselJS](https://github.com/u-kudox/Vector3D_for_EaselJS) if you want.

## Example1
	var m1 = new createjs.Matrix3D();
	console.log(m1.toString()); // [Matrix3D [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]]
	var m2 = new createjs.Matrix3D([1.5, 0, 0, 0, 0, 1.25, 0, 0, 0, 0, 2, 0, 15, -25, 100, 1]);
	console.log(m2.toString()); // [Matrix3D [1.5,0,0,0,0,1.25,0,0,0,0,2,0,15,-25,100,1]]

## Example2
	var m1 = new createjs.Matrix3D();
	m1.appendRotation(-70, createjs.Vector3D.X_AXIS, new createjs.Vector3D(0, 10, 20));
	m1.appendScale(1, 2, 3);
	m1.appendTranslation(0, 50, 100);
	console.log(m1.toString()); // [Matrix3D [1,0,0,0,0,0.6840403079986572,-2.819077968597412,0,0,1.879385232925415,1.0260604619979858,0,0,25.57189178466797,167.66957092285156,1]]

## Example3
	var m1 = new createjs.Matrix3D();
	m1.appendTranslation(100, 200, 300);
	m1.appendScale(2, 3, 4);
	var i1 = m1.clone();
	i1.invert();
	m1.prepend(i1);
	console.log(m1.toString()); // [Matrix3D [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]]

## Properties
* determinant [read only]
* position
* rawData
* DEG_TO_RAD [static]

## Methods
* append
* appendRotation
* appendScale
* appendTranslation
* clone
* copyColumnFrom
* copyColumnTo
* copyFrom
* copyRawDataFrom
* copyRawDataTo
* copyRowFrom
* copyRowTo
* copyToMatrix3D
* decompose
* deltaTransformVector
* identity
* invert
* prepend
* prependRotation
* prependScale
* prependTranslation
* recompose
* toString
* transformVector
* transformVectors
* transpose

## Resources
* Read the [AS3 API Documentation](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Matrix3D.html), because API is similar to AS3.

## Contact and bug reports
* [kudox.jp](http://kudox.jp/contact)
* [Twitter](http://twitter.com/u_kudox)

## License
public domain