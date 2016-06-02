module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-protractor-runner');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {
            options: {
                stout: true
            },
            npm_install: {
                command: 'npm install'
            },
            bower_install: {
                command: 'bower install'
            }
        },

        clean : {
            common : {
                src : [
                    "node_modules/tinynews-common"
                ]
            }
        },

        connect: {
            options: {
                base: '/app'
            },
            webserver: {
                options: {
                    port: 8888,
                    keepalive: true
                }
            },
            devserver: {
                options: {
                    port: 8888
                }
            },
            testserver: {
                options: {
                    port: 9999
                }
            },
            coverage: {
                options: {
                    base: 'coverage/',
                    port: 5555,
                    keepalive: true
                }
            }
        },

        open: {
            devserver: {
                path: 'http://localhost:8888'
            },
            coverage: {
                path: 'http://localhost:5555'
            }
        },

        karma: {
            unit: {
                configFile: './test/frontend/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: './test/frontend/karma-unit.conf.js',
            },
            midway: {
                configFile: './test/frontend/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: './test/frontend/karma-midway.conf.js',
            },
            e2e: {
                configFile: './test/frontend/karma-e2e.conf.js',
                autoWatch: false,
                singleRun: true
            },
            e2e_auto: {
                configFile: './test/frontend/karma-e2e.conf.js',
            }
            
        },
                       
        mochaTest: {
            test: {
                options: {
                    reporter: 'nyan',
                    mocha: require('mocha')
                },
                src: ['test/backend/*.js']
            }
        },

        concat: {
            css: {
                src: [
                    'public/css/*.css'
                ],
                dest: 'public/compiled.css'
            },
            js: {
                src: [
                    'public/js/*.js',
                    'public/js/**/*.js'
                ],
                dest: 'public/compiled.js'
            }
        },

        cssmin: {
            css: {
                src: 'public/compiled.css',
                dest: 'public/compiled.min.css'
            }
        },

        uglify: {
            js: {
                files: {
                    'public/compiled.min.js': ['public/compiled.js']
                }
            },
            options: {
                mangle: false
            }
        },

        watch: {
            files: [
                'public/css/**/*.css',
                'public/css/*.css',
                'public/js/**/*.js',
                'public/js/*.js'
            ],
            tasks: ['concat', 'cssmin', 'uglify']
        },
        
        protractor:{
            login_test: {
                options: {
                    configFile: "./test/frontend/protractor.conf.js",
                    args: {}
                }
            }
        }
    });

    grunt.registerTask('default', [ 'concat:css', 'cssmin:css', 'concat:js', 'uglify:js' ]);

    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:midway', ['connect:testserver', 'karma:midway']);
    grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);
    
    grunt.registerTask('test_frontend', ['protractor:login_test']);
    grunt.registerTask('test:backend', ['mochaTest:test']);

    grunt.registerTask('install', ['shell:npm_install', 'shell:bower_install', 'clean:common', 'shell:npm_install']);
};