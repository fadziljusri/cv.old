var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var htmlmin = require('gulp-htmlmin');

// dev - localhost
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/css/**/*.css', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})
gulp.task('default', function(callback) {
    runSequence(['browserSync', 'watch'],
        callback
    )
})

// build distribution (./docs/)
gulp.task('useref', function() {
    return gulp.src('app/index.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('docs'))
});
gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('docs/images'))
});
gulp.task('CNAME', function() {
    return gulp.src('app/CNAME')
        .pipe(gulp.dest('docs'))
});
gulp.task('clean:docs', function() {
    return del.sync('docs');
});
gulp.task('build', function(callback) {
    runSequence('clean:docs', ['useref', 'images', 'CNAME'],
        callback
    )
});

//  test distribution (./docs/)
gulp.task('test', function() {
    browserSync.init({
        server: {
            baseDir: 'docs'
        },
    })
})