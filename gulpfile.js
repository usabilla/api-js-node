const gulp = require('gulp');
const babel = require('gulp-babel');

const paths = {
  scripts: 'src/index.js'
};

gulp.task('babel', () => {
  return gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['babel'], () => {
  gulp.watch(paths.scripts, ['babel']);
});
