var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    gulp.src('index.js')
        .pipe(uglify('index.min.js'))
        .pipe(gulp.dest('./'))
});