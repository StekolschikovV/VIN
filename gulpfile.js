var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var pug = require('gulp-pug');
var gulpJade = require('gulp-jade');
var jade = require('jade');


gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function () {
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./assets/img/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('templates', function () {
    gulp.src(['./src/jade/**/*.jade', '!./src/jade/components/*.jade'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(gulpJade({
            jade: jade
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('styles', function () {
    gulp.src(['./src/styles/**/*.sass'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minifycss())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', function () {
    return gulp.src('./src/scripts/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('script.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch("src/images/**/*", ['images']);
    gulp.watch("src/styles/**/*.sass", ['styles']);
    gulp.watch("src/scripts/**/*.js", ['scripts']);
    gulp.watch("src/jade/**/*.jade", ['templates']);
    gulp.watch("*.html", ['bs-reload']);
});