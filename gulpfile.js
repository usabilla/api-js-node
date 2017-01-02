const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const babelify = require('babelify');

const paths = {
  src: './src',
  dist: './dist',
  entry: './src/index.js',
  filename: 'index.js',
};

gulp.task('build', () => {
  return browserify(paths.entry, {
      builtins: false,
      standalone: 'usabilla-api',
    })
    .transform(babelify)
    .bundle()
    .pipe(source(paths.filename))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['build'], () => {
  gulp.watch(paths.src, ['build']);
});
