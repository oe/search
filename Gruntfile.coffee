module.exports = (grunt)->

  buildPath = 'build'

  grunt.initConfig =
    pkg: grunt.file.readJSON 'package.json'
    copy:
      src: [
        'cache.manifest'
        'googlelink.user.js'
        'index-template.html'
        'assets/**'
        '!assets/**.coffee'
        '!assets/**.map'
        '!assets/js/tpl.*'
        '!assets/js/config.js'
      ]
      dest: buildPath + '/'

    replace:
      main:
        options:
          patterns: [
            {
              match: '$$APP_HTML$$'
              replacement: ->
                do require 'assets/js/config.js'
            }
            {
              match: '$$TIMESTAMP$$'
              replacement: ->
                Date.now()
            }
          ]
        files: [
          {
            src: "#{buildPath}/index-template.html"
            dest: "#{buildPath}/index.html"
          }
          {
            src: "#{buildPath}/cache.manifest"
          }

        ]

    clean:
      main:
        src: "#{buildPath}/index-template.html"



  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-replace'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'default', ['copy', 'replace', 'clean']