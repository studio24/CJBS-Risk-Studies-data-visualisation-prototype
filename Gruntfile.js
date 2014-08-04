/**
 * Using Grunt to make a dynamically loaded site become fully
 * static, without any includes.
 *
 * Development path: /web
 * Production path: /dist/web
 */
module.exports = function(grunt) {
    'use strict';

    // Create the project object for easier editing
    grunt.initConfig({
        // Read the package file
        pkg: grunt.file.readJSON('package.json'),

        // Settings for the project paths
        project: {
            assets: 'app/assets',
            css: '<%= project.assets %>/css',
            scss: '<%= project.assets %>/scss',
            js: '<%= project.assets %>/js',
            img: '<%= project.assets %>/img',
            fonts: '<%= project.assets %>/fonts'
        },

        // Settings for the distribution paths
        dist: {
            assets: 'dist/assets',
            css: '<%= dist.assets %>/css',
            scss: '<%= dist.assets %>/scss',
            js: '<%= dist.assets %>/js',
            img: '<%= dist.assets %>/img',
            fonts: '<%= dist.assets %>/fonts'
        },

        /**
         * Setup notifications to be run after certain tasks have been
         * completed, so we know when things are done.
         */
        notify: {
            watchsass: {
                options: {
                    title: 'Grunt run successfully',
                    message: 'Grunt watch SASS task has finished running'
                }
            },
            watchjs: {
                options: {
                    title: 'Grunt run successfully',
                    message: 'Grunt watch JS task has finished running'
                }
            },
            build: {
                options: {
                    title: 'Grunt build complete',
                    message: 'All tasks have been run successfully'
                }
            }
        },

        /**
         * Banner to be added to all Javascript and CSS
         * files with the option set to display the banner
         */
        tag : {
            banner: '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                ' */\n'
        },

        /**
         * SASS compiler will be on the watcher and will look
         * for changes in project *.scss files. It will then
         * move them into the css folder for the distribution
         */
        sass: {
            dist: {
                options: {
                    banner: '<%= tag.banner %>'
                },
                files: {
                    '<%= dist.css %>/main.css' : '<%= project.scss %>/main.scss'
                }
            }
        },

        /**
         * JSHint is important to keep our Javascript consistent and
         * strict. The options should be configured to suit the dev
         * team style
         */
        jshint: {
            files: ['<%= project.js %>/*.js'],
            options: {
                globals: {
                    "$": true,
                    "jQuery": true,
                    "console": true,
                    "module": true,
                    "document": true,
                    "window": true
                }
            }
        },

        /**
         * Compress all of the Javascript files and move them to
         * the distribution JS folder and append .min.js as the
         * extension for consistency
         */
        uglify: {
            options: {
                // Set to true for full production environment
                mangle: false,
                // Set to true if you want to debug the JS
                beautify: true
            },
            files: {
                src: ['<%= project.js %>/**/*', '!<%= project.js %>/vendor/**'],
                dest: '<%= dist.js %>/',
                expand: true,
                flatten: true,
                ext: '.min.js',
                filter: 'isFile'
            }
        },

        /**
         * This task will sync files from one directory to another, without
         * copying un-changed files or directories. This is quicker than the
         * grunt-copy module
         */
        sync: {
            vendor: {
                files: [{
                    flatten: false,
                    expand: true,
                    src: '**/*',
                    dest: '<%= dist.js %>/vendor/',
                    cwd: '<%= project.js %>/vendor/',
                    filter: 'isFile'
                }],
                verbose: true
            },
            html: {
                files: [{
                    flatten: false,
                    expand: true,
                    src: ['index.html', 'templates/**/*'],
                    dest: 'dist/',
                    cwd: 'app/',
                    filter: 'isFile'
                }],
                verbose: true
            },
            img: {
                files: [{
                    flatten: false,
                    expand: true,
                    src: '**/*',
                    dest: '<%= dist.img %>/',
                    cwd: '<%= project.img %>/',
                    filter: 'isFile'
                }],
                verbose: true
            },
            fonts: {
                files: [{
                    flatten: false,
                    expand: true,
                    src: '**/*',
                    dest: '<%= dist.fonts %>/',
                    cwd: '<%= project.fonts %>/',
                    filter: 'isFile'
                }],
                verbose: true
            }
        },

        /**
         * This watch task will keep Grunt idle until one of the files
         * in the file array for each task is modified, and then it will
         * run the tasks from the task array
         */
        watch: {
            sass: {
                files: '<%= project.scss %>/**/*',
                tasks: ['sass:dist', 'notify:watchsass'],
                options: {
                    livereload: 35729
                }
            },
            js: {
                files: '<%= project.js %>/**/*',
                tasks: ['jshint', 'uglify', 'notify:watchjs'],
                options: {
                    livereload: 35729
                }
            },
            vendor: {
                files: '<%= project.js %>/vendor/**/*',
                tasks: ['sync:vendor'],
                options: {
                    livereload: 35729
                }
            },
            html: {
                files: ['app/index.html', 'app/templates/**/*'],
                tasks: ['sync:html'],
                options: {
                    livereload: 35729
                }
            },
            img: {
                files: '<%= project.img %>/**/*',
                tasks: ['sync:img'],
                options: {
                    livereload: 35729
                }
            },
            fonts: {
                files: '<%= project.fonts %>/**/*',
                tasks: ['sync:fonts'],
                options: {
                    livereload: 35729
                }
            }
        }
    });

    /**
     * Load Grunt plugins
     */
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * Default task
     */
    grunt.registerTask('default', [
        'watch'
    ]);

    /**
     * Build task, concat everything into dist folder
     */
    grunt.registerTask('build', [
        'jshint',
        'sync:vendor',
        'sync:html',
        'sync:img',
        'sync:fonts',
        'sass:dist',
        'uglify',
        'notify:build'
    ]);
};