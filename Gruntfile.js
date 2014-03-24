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
				src : ['lib/matrix3d-*.js', 'examples/js/matrix-*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('matrix3d', ['clean:matrix3d', 'uglify:matrix3d', 'copy:matrix3d']);
};