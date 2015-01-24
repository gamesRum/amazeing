'use strict';

var browserSync = require('browser-sync');

var gulp = require('gulp');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: './build/',
    },
    port: 8000
  });
});
