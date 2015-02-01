'use strict';

var gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch('./assets/audio/**/*', ['build:audio']);
  gulp.watch('./assets/fonts/**/*', ['build:fonts']);
  gulp.watch(['./assets/*.jpg', './assets/*.png'], ['build:images']);

  gulp.watch('./src/*.jade', ['build:html']);
  gulp.watch(
    [
      './config.js',
      './src/scripts/**/*.js'
    ], ['lint', 'build:js']
  );
  gulp.watch('./src/stylesheets/*.styl', ['build:css']);
});
