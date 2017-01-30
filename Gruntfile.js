'use strict';

module.exports = function(grunt) {
  const SRC_FILES = ['src/**/*.ts'];
  require('jit-grunt')(grunt);

  grunt.initConfig({
    tslint: {
      options: {
        configuration: "tslint.json",
        force: false
      },
      files: {
        src: SRC_FILES
      }
    },
    nodemon: {
      web: {
        script: 'dist/app.js',
        options: {
          watch: ['dist'],
          ignore: ['test/**', 'scripts/**', '.git/**', '*.swp', 'node_modules/**']
        }
      }
    },
    run: {
      tsc: {
        cmd: 'npm',
        args: ['run', 'tsc']
      }
    },
    watch: {
      src: {
        files: 'src/**/*.ts',
        tasks: 'run:tsc'
      }
    },
    concurrent: {
      run: {
        tasks: ['watch', 'nodemon:web'],
        options: { logConcurrentOutput: true }
      }
    }
  });

  grunt.registerTask('default', ['concurrent:run']);
  grunt.registerTask('style', ['check-modules', 'tslint']);
};