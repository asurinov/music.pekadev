var gulp = require("gulp");
var concat = require("gulp-concat");
var less = require("gulp-less");
var inject = require("gulp-inject");
var del = require('del');
var angularSort = require('gulp-angular-filesort');
var series = require('stream-series');
var bowerSrc = require('main-bower-files');
var runSequence = require('run-sequence');

var config = {
    viewsSourcePath: './src/views/**/*.ejs',
    viewsDestinationPath: './views',
    indexView: 'index.ejs',
    appScriptsSourcePath: './src/scripts/**/*.js',
    appStyleSourcePath: './src/styles/**/*.less',
    distPath: './public',
    scriptsDestinationSubPath: '/scripts',
    styleDestinationSubPath: '/styles',
    fontsDestinationSubPath: '/fonts'
};

gulp.task('BuildFonts', function () {
    return gulp.src([
        './bower_components/bootstrap/fonts/**/*.woff',
        './bower_components/bootstrap/fonts/**/*.woff2',
        './bower_components/bootstrap/fonts/**/*.ttf'
    ])
    .pipe(gulp.dest(config.distPath + config.fontsDestinationSubPath));
});

gulp.task('BuildStyles', function () {
    var vendor = gulp.src(bowerSrc('**/*.css'))
        .pipe(gulp.dest(config.distPath + config.styleDestinationSubPath));

    var app = gulp.src([config.appStyleSourcePath])
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(config.distPath + config.styleDestinationSubPath));

    return gulp.src([config.viewsDestinationPath + '/' + config.indexView])
        .pipe(inject(series(vendor, app), { ignorePath: '/public' }))
        .pipe(gulp.dest(config.viewsDestinationPath, {overwrite: true}));
});

gulp.task('BuildScripts', function () {
    var vendor = gulp.src(bowerSrc('**/*.js'))
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));

    var app = gulp.src([config.appScriptsSourcePath])
        .pipe(angularSort())
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));

    return gulp.src([config.viewsDestinationPath + '/' + config.indexView])
        .pipe(inject(series(vendor, app), { ignorePath: '/public' }))
        .pipe(gulp.dest(config.viewsDestinationPath, {overwrite: true}));
});

gulp.task('Clean', function () {
    return del([config.distPath + '/**/*.*', './views/**/*.*']);
});

gulp.task('CopyViews', function () {
    return gulp.src([config.viewsSourcePath])
        .pipe(gulp.dest(config.viewsDestinationPath));
});

gulp.task('buildAppResources', function(){
    runSequence('Clean', ['CopyViews', 'BuildFonts'], 'BuildStyles', 'BuildScripts');
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*', ['buildAppResources']);
});