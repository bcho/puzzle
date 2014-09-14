module.exports = (grunt) ->

  grunt.initConfig
    # Meta
    pkg: grunt.file.readJSON 'package.json'
    dir:
      src  : './app'
      dist : './dist'

    # Tasks
    clean:
      dist: ['<%= dir.dist %>']

    coffee:
      build:
        expand: true
        cwd: '<%= dir.src %>'
        src: ['**/*.coffee']
        dest: '<%= dir.dist %>'
        ext: '.js'

    connect:
      server:
        options:
          base: [
            '<%= dir.dist %>'
          ]
          port: 9000
          useAvailabePort: true

    copy:
      dist:
        files: [{
          expand: true
          cwd: '<%= dir.src %>'
          src: ['./**/*.html', './**/*.css', './**/*.png']
          dest: '<%= dir.dist %>'
        }]

    watch:
      files: ['<%= dir.src %>/**/*']
      options:
        spawn: false
        livereload: true
      tasks: ['build']


  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', [
    'clean:dist'
    'copy:dist'
    'coffee:build'
  ]

  grunt.registerTask 'default', [
    'build'
    'connect'
    'watch'
  ]
