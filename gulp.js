/* Created by handsome qiu */
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const sequence = require('run-sequence');
gulp.task('watch', [], function (cb) {
    livereload.listen();
    gulp.watch(['**/*.*', '!.git/**', "!.idea/**", '!node_modules/**'], []).on('change', function (event) {
        livereload.changed(event.path);
    });
});

gulp.task('default', function (cb) {
    sequence('watch', cb);
});