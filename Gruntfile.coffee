module.exports = (grunt)->
  # SDK的发布目录地址
  BUILD_PATH = 'build'
  # path = require 'path'
  # console.log path.resolve 'assets/libs/underscore.js'
  # html = require './assets/js/tpl.js'
  # console.log html()

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    copy:
      main:
        files: [
          {
            src: [
              './assets/**'
              '!./assets/**/*.coffee'
              '!./assets/**/*.map'
              '!./assets/libs/underscore.js'
              '!./assets/js/config.js'
              '!./assets/js/tpl.*'
              'index-template.html'
              'googlelink.user.js'
              'README.md'
              'cache.manifest'
            ]
            dest: BUILD_PATH + '/'
            filter: 'isFile'
            expand: true
          }
        ]

    # 清理文件夹
    clean:
      options:
        # 强制清理
        force: true
      afterBuild: "#{BUILD_PATH}/index-template.html"
      beforeBuild: "#{BUILD_PATH}/"

    replace:
      options:
        patterns: [
          {
            match: '$$APP_HTML$$'
            replacement: ->
              do require './assets/js/tpl.js'
          }
          {
            match: '$$TIMESTAMP$$'
            replacement: ->
              Date.now()
          }
        ]

      main:
        files: [
          {
            src: "#{BUILD_PATH}/index-template.html"
            dest: "#{BUILD_PATH}/index.html"
          }
          {
            src: 'build/cache.manifest'
            dest: 'build/cache.manifest'
          }
        ]

    cssmin:
      main:
        src: "#{BUILD_PATH}/assets/css/style.css"
        dest: "#{BUILD_PATH}/assets/css/style.css"

    htmlmin:
      main:
        options:
          removeComments: true
          collapseWhitespace: true
        src: "#{BUILD_PATH}/index.html"
        dest: "#{BUILD_PATH}/index.html"

    uglify:
      main:
        src: "#{BUILD_PATH}/assets/js/app.js"
        dest: "#{BUILD_PATH}/assets/js/app.js"

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-replace'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'


  grunt.registerTask 'default', ['clean:beforeBuild', 'copy', 'replace', 'clean:afterBuild', 'cssmin', 'htmlmin', 'uglify']
