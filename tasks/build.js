'use strict';

var fs = require('fs');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var program = require('commander');

var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var buffer = require('gulp-buffer');
var cssmin = require('gulp-cssmin');
var ignore = require('gulp-ignore');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var linter = require('gulp-eslint');
var rename = require('gulp-rename');
var size = require('gulp-size');
var stylus = require('gulp-stylus');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

var cfg = require('../config');

program.on('--help', function() {
  console.log('  Tasks:');
  console.log();
  console.log('    build:all\t\tbuild the game and all assets');
  console.log('    build:audio\t\tbuild audio assets');
  console.log('    build:fonts\t\tbuild fonts assets');
  console.log('    build:images\tbuild images assets');
  console.log('    build:html\t\tconvert Jade files to HTML files');
  console.log('    build:js\t\tbuild JS files');
  console.log('    build:css\t\tconvert Stylus files to CSS files');
  console.log('    build:vendors\tbuild vendors files');
  console.log();
  console.log('    clean:all\t\tremove all generated files');
  console.log('    clean:audio\t\tremove generated audio assets');
  console.log('    clean:fonts\t\tremove generated fonts assets');
  console.log('    clean:images\tremove generated images assets');
  console.log('    clean:html\t\tremove generated HTML files');
  console.log('    clean:js\t\tremove generated JS files');
  console.log('    clean:css\t\tremove generated CSS files');
  console.log('    clean:vendors\tremove generated vendors files');
  console.log();
  console.log('    serve\t\tlaunch local server');
  console.log('    watch\t\twatch for file changes and rebuild automatically');
  console.log();
});

program
  .option('-p, --prod', 'enforce production environment')
  .option('-c, --compress', 'produce a zip package')
  .parse(process.argv);

gulp.task('build:all', [
  'build:audio',
  'build:fonts',
  'build:images',
  'build:html',
  'build:js',
  'build:css',
  'build:vendors'
]);

gulp.task('build:audio', function() {
  return gulp.src('./assets/audio/**/*')
    .pipe(gulp.dest('./build/assets/audio/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:fonts', function() {
  return gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./build/assets/fonts'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:images', function() {
  return gulp.src('./assets/img/**/*')
    .pipe(gulp.dest('./build/assets/img'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:html', function() {
  return gulp.src('./src/*jade')
    .pipe(jade({
      pretty: !program.prod,
      data: {
        name: cfg.name,
        debug: !program.prod
      }
    }))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:js', function() {
  return browserify('./src/scripts/main.js', {debug: !program.prod})
    .bundle()
    .on('error', onBrowserifyError)
    .pipe(source('game.js'))
    .pipe(buffer())
    .pipe(gulpif(program.prod, uglify()))
    .pipe(gulpif(program.prod, rename('game.min.js')))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:css', function() {
  return gulp.src('./src/stylesheets/*.styl')
    .pipe(stylus())
    .pipe(buffer())
    .pipe(gulpif(program.prod, cssmin()))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:vendors', function() {
  var bowerConfig = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));
  var vendors = [
    './' + bowerConfig['directory'] + '/phaser/build/phaser*',
    './' + bowerConfig['directory'] + '/zepto/zepto*min*',
    './' + bowerConfig['directory'] + '/zepto-detect/zepto-detect.min.js'
  ];

  return gulp.src(vendors)
    .pipe(ignore('*.ts'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('build:dist', ['build:all'], function() {
  if (!program.prod) {
    gutil.log(gutil.colors.yellow('WARNING'), gutil.colors.grey('Missing flag --prod'));
    gutil.log(gutil.colors.yellow('WARNING'), gutil.colors.grey('You should switch to prod environment'));
  }

  return gulp.src('./build/**/*')
    .pipe(gulpif(program.compress, zip('build.zip')))
    .pipe(size())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('lint', function() {
  gulp.src('./src/scripts/**/*.js')
    .pipe(linter())
    .pipe(linter.format());
});

function onBrowserifyError(err) {
  gutil(gutil.colors.red('ERROR'), gutil.colors.grey(err.message));
  this.emit('end');
};
