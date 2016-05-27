const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const $ = require('gulp-load-plugins')();

const customOptions = {
  entries: './index.js',
  debug: true
};
const options = assign({}, watchify.args, customOptions);
const sources = watchify(browserify(options));

sources.transform(babelify);

gulp.task('scripts', bundle);
sources.on('update', bundle);
sources.on('log', $.util.log);

function bundle () {
  return sources.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(vinylSourceStream('index.js'))
    .pipe(vinylBuffer())
    .pipe(gulp.dest('dist'));
}
