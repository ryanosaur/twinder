var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function() {
  gulp.src('./source/javascripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/javascripts/'));
});
