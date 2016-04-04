'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            coverage: {
                src: ['coverage/']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    mask: '*.spec.js'
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.spec.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-mocha-test');


    grunt.registerTask('test', ['clean', 'mocha_istanbul']);

    // Run 'node-debug grunt debug' to debug the code
    // NOTE: This requires node-inspector to be installed
    grunt.registerTask('debug', ['mochaTest']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
