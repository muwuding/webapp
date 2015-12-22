// Wrapper函数
module.exports = function(grunt) {
  'use strict';

  // 构建配置任务
  grunt.initConfig({

    // 读取package.json的内容，形成个json数据
    pkg: grunt.file.readJSON('package.json'),

    // 注释信息
    banner: '/*!\n' +
          ' * name:<%= pkg.name %>\n' + 
          ' * version:<%= pkg.version %>\n' +
          ' * date:<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * Copyright (c)<%= grunt.template.today("yyyy") %>\n' +
          ' */',

    // 清除发布文件
    clean: {
      dist: {
        src: ['dist']
      }
    },

    // 编译less
    less: {
      dist: {
        options: {
          banner: '<%= banner %>',
          compress: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/less',
            src: ['**/*.less','!common/**/*','!mixin/**/*'],
            dest: 'dist/css',
            ext: '.min.css'
          }
        ]
      }
    },

    //压缩js文件
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        files: [
          {
            expand: true,
            cwd: 'src/js',
            src: ['**/*.js',
                  '!bootstrap/**/*.js',
                  '!flexslider/**/*.js',
                  '!fullPage/**/*.js',
                  '!jquery/**/*.js',
                  '!jquery-ui/**/*.js',
                  '!config-news.js'],
            dest: 'dist/js',
            ext: '.min.js'
          }
        ]
      }
    },

    // 复制文件
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'src/fonts',
            src: ['**/*'],
            dest: 'dist/src/fonts'
          }
        ]
      },
      css: {
        files: [
          {
            expand: true,
            cwd: 'src/css',
            src: ['**/*'],
            dest: 'dist/css'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: 'src/images',
            src: ['**/*'],
            dest: 'dist/images'
          }
        ]
      },
      scripts: {
        files: [
          {
            expand: true,
            cwd: 'src/js',
            src: ['bootstrap/**/*',
                  'flexslider/**/*',
                  'fullPage/**/*',
                  'jquery/**/*',
                  'jquery-ui/**/*',
                  'config-news.js'],
            dest: 'dist/js'
          }
        ]
      },
      html: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.html'],
            dest: 'dist'
          }
        ]
      },
      download: {
        files: [
          {
            expand: true,
            cwd: 'src/download',
            src: ['**/*'],
            dest: 'dist/download'
          }
        ]
      }
    },

    // 本地服务
    connect: {
      options: {
        port: 9000,
        hostname: '*', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
        livereload: 35729  //声明给 watch 监听的端口
      },
      server: {
        options: {
          open: false, //自动打开网页 http://
          base: [
            'dist'  //主目录
          ]
        }
      }
    },

    // 监听文件修改
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('此次监听共历时' + time + '毫秒');
          grunt.log.writeln('程序尚未退出，还在等着监听你的其他操作哟~');
        }
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy']
      },
      uglify: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify']
      },
      images: {
        files: ['src/images/**/*'],
        tasks: ['copy']
      },
      script: {
        files: ['src/js/app/**/*.js'],
        tasks: ['uglify']
      },
      livereload: {
        options: {
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },
        files: [  //下面文件的改变就会实时刷新网页
          'src/**/*'
        ]
      }
    }
  });

  // 加载Grunt插件
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认的Grunt任务
  grunt.registerTask('default', ['clean:dist', 'less', 'uglify','copy', 'connect', 'watch']);
};