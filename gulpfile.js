var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src('index.js')
        .pipe(uglify())
        .pipe(rename('ajax.min.js'))
        .pipe(gulp.dest('./'))
});