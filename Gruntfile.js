module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		uglify : {
			matrix3d : {
				options : {
					banner : grunt.file.read('src/License.js'),
				},
				src : ['src/Matrix3D.js'],
				dest : 'lib/matrix3d-<%= pkg.version %>.min.js'
			}
		},
		copy : {
			matrix3d : {
				files : [{expand:true, cwd:'lib/', src:'matrix3d-<%= pkg.version %>.min.js', dest:'examples/js/'}]
			}
		},
		watch : {
			matrix3d : {
				files : ['src/Matrix3D.js', 'src/License.js'],
				tasks : ['matrix3d']
			}
		},
		clean : {
			matrix3d : {
				src : ['lib/matrix3d-*.js', 'examples/js/matrix3d-*.js']
			}
		},
		replace : {
			matrix3d : {
				src : ['examples/*.html'],
				overwrite : true,
				replacements : [{
					from : /js\/matrix3d-.+min\.js/,
					to : 'js/matrix3d-<%= pkg.version %>.min.js'
				}]
			},
			vector3d : {
				src : ['examples/*.html'],
				overwrite : true,
				replacements : [{
					from : /js\/vector3d-.+min\.js/,
					to : 'js/vector3d-1.1.0.min.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('matrix3d', ['clean:matrix3d', 'uglify:matrix3d', 'copy:matrix3d', 'replace:matrix3d']);
};