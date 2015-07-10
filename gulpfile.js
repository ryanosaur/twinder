var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

gulp.task('js', function() {
  return gulp.src('./source/javascripts/**/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./public/javascripts/'));
});

