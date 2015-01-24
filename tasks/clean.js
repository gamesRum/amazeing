'use strict';

var gulp = require('gulp');
var del = require('del');

gulp.task('clean:all', function() {
  del('./build/', {force: true});
});

gulp.task('clean:audio', function() {
  del('./build/assets/audio/', {force: true});
});

gulp.task('clean:fonts', function() {
  del('./build/assets/fonts/', {force: true});
});

gulp.task('clean:images', function() {
  del(['./build/assets/*.jpg', './dist/assets/*.png'], {force: true});
});

gulp.task('clean:html', function() {
  del('./build/*.html', {force: true});
});

gulp.task('clean:js', function() {
  del('./build/js/game*.js', {force: true});
});

gulp.task('clean:css', function() {
  del('./build/css/*.css', {force: true});
});

gulp.task('clean:vendors', function() {
  del('./build/js/phaser*', {force: true});
});

gulp.task('clean:dist', function() {
  del('./dist/', {force: true});
});
