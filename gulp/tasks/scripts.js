'use strict';

var config = require('../config');
var gulp   = require('gulp');
var $      = require('gulp-load-plugins')({lazy: true});
var path   = require('path');

/**
 * Lint app JS for errors, transpile ES6 to ES5 and copy to /build
 */
gulp.task('scripts', function(){
  config.log('Linting and transpiling appjs');

  return  gulp
          .src(config.appjs)
          .pipe($.babel())
          .pipe($.memoryCache('appjs'))
          .pipe($.jshint())
          .pipe($.jshint.reporter('jshint-stylish'))
          .pipe(gulp.dest(config.build + '/app'))
          .pipe($.size({title:'scripts', showFiles: true}));
});
/**
 * Lint gulpfile for errors
 */
gulp.task('jshint:gulp', function(){
  config.log('Linting gulp files');

    return  gulp
           .src(config.gulpjs)
           .pipe($.memoryCache('gulpjs'))
           .pipe($.jshint())
           .pipe($.jshint.reporter('jshint-stylish'));
});
/**
 * Lint, minify, transpile and copy app JS to /dist
 */
gulp.task('scripts:dist', function(){
  config.log('Linting, minifying and transpiling appjs');

  return  gulp
          .src(config.appjs)
          .pipe($.jshint())
          .pipe($.jshint.reporter('jshint-stylish'))
          .pipe($.jshint.reporter('fail'))
          .pipe($.babel())
          .pipe($.ngAnnotate())
          .pipe($.concat('app.js'))
          .pipe($.uglify()).on('error', config.errorHandler('Uglify'))
          .pipe($.rev())
          .pipe(gulp.dest(config.dist + '/app'))
          .pipe($.size({title:'scripts', showFiles: true}));
});
/**
 * Run on git commit on all js files in project to check for errors and prevent commit on fail
 */
gulp.task('scripts:commit', function(){
  return gulp
          .src(path.join(config.src, '/**/*.js'))
          .pipe($.jshint(config.jshint))
          .pipe($.jshint.reporter('jshint-stylish'))
          .pipe(config.gitReporter('js'));
});
