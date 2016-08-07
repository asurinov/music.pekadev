var gulp = require("gulp");
var del = require('del');
var series = require('stream-series');
var bowerSrc = require('main-bower-files');
var plugins = require('gulp-load-plugins')();

var config = {
    templatesSourcePath: './src/templates/**/*.html',
    mediaSourcePath: './src/media/**/*.*',
    viewsDestinationPath: './views',
    indexView: 'index.html',
    appScriptsSourcePath: './src/scripts/**/*.js',
    appStyleSourcePath: './src/styles/**/*.less',
    distPath: './public',
    scriptsDestinationSubPath: '/scripts',
    styleDestinationSubPath: '/styles',
    fontsDestinationSubPath: '/fonts',
    mediaDestinationSubPath: '/media'
};

var debug = true;

gulp.task('BuildFonts', function () {
    return gulp.src([
        './bower_components/bootstrap/fonts/**/*.woff',
        './bower_components/bootstrap/fonts/**/*.woff2',
        './bower_components/bootstrap/fonts/**/*.ttf',
        './bower_components/font-awesome/fonts/**/*.woff',
        './bower_components/font-awesome/fonts/**/*.woff2',
        './bower_components/font-awesome/fonts/**/*.ttf'
    ])
    .pipe(gulp.dest(config.distPath + config.fontsDestinationSubPath));
});

gulp.task('VendorStyles', function(){
    return gulp.src(bowerSrc('**/*.css'))
        .pipe(plugins.concat('vendors.css'))
        .pipe(gulp.dest(config.distPath + config.styleDestinationSubPath));
});

gulp.task('AppStyles', ['VendorStyles'], function () {
    return gulp.src([config.appStyleSourcePath])
        .pipe(plugins.less())
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.if(!debug, plugins.cssnano()))
        .pipe(gulp.dest(config.distPath + config.styleDestinationSubPath));
});

gulp.task('BuildScripts', function () {
    var vendor = gulp.src(bowerSrc('**/*.js'))
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));

    var app = gulp.src([config.appScriptsSourcePath])
        .pipe(plugins.angularFilesort())
        .pipe(plugins.if(!debug, plugins.concat('app.js')))
        .pipe(plugins.if(!debug, plugins.uglify()))
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));

    return gulp.src([config.viewsDestinationPath + '/' + config.indexView])
        .pipe(plugins.inject(series(vendor, app), { ignorePath: '/public' }))
        .pipe(gulp.dest(config.viewsDestinationPath, {overwrite: true}));
});

gulp.task('Clean', function () {
    return del([config.distPath + '/**/*.*', './views/**/*.*']);
});

gulp.task('CopyViews', function () {
    return gulp.src([config.templatesSourcePath])
        .pipe(gulp.dest(config.viewsDestinationPath));
});

gulp.task('CopyMedia', function () {
    return gulp.src([config.mediaSourcePath])
        .pipe(gulp.dest(config.distPath + config.mediaDestinationSubPath));
});

gulp.task('CacheTemplates', function () {
    return gulp.src(config.templatesSourcePath)
        .pipe(plugins.angularTemplatecache({module: 'app', root: '/'}))
        .pipe(gulp.dest('./src/scripts/'));
});

gulp.task('buildAppResources', ['Clean'], function(cb){
    plugins.sequence(['CopyViews', 'CopyMedia', 'CacheTemplates', 'BuildFonts'], 'AppStyles', 'BuildScripts')(cb);
});

gulp.task('release', ['Clean'], function(cb){
    debug = false;
    plugins.sequence(['CopyViews', 'CopyMedia', 'CacheTemplates', 'BuildFonts'], 'AppStyles', 'BuildScripts')(cb);
});

gulp.task('watch', ['buildAppResources'], function() {
    gulp.watch('./src/**/*', ['buildAppResources']);
});