var gulp = require('gulp'),
    react = require('gulp-react');

var paths = {
  react: ['.src/react_compenents/**/.js'],
}

gulp.task('react', function() {
  return gulp.src(paths.react)
            .pipe(react())
            .pipe(gulp.dest('dist/react_components'));
});
