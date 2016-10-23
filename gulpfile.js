var gulp = require("gulp");
var del = require('del');
var series = require('stream-series');
var bowerSrc = require('main-bower-files');
var plugins = require('gulp-load-plugins')();

var tsProject = plugins.typescript.createProject('tsconfig.json');

var config = {
    templatesSourcePath: './src/templates/**/*.html',
    mediaSourcePath: './src/media/**/*.*',
    indexView: 'index.html',
    appScriptsSourcePath: './src/scripts/**/*.ts',
    appStyleSourcePath: './src/styles/main.less',
    distPath: './public',
    scriptsDestinationSubPath: '/scripts',
    styleDestinationSubPath: '/styles',
    fontsDestinationSubPath: '/fonts',
    mediaDestinationSubPath: '/media',
    librariesPath: '/lib'
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

gulp.task('VendorsScripts', function(){
    return gulp.src(bowerSrc('**/*.js'))
        .pipe(plugins.concat('vendors.js'))
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));
});

gulp.task('AppScripts', ['VendorsScripts'], function () {
    var app = tsProject.src([config.appScriptsSourcePath])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript())
        .pipe(plugins.angularFilesort())
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.if(!debug, plugins.uglify({
            mangle: false,
            output: {
                beautify: debug
            },
            compress: {
                hoist_funs: false,
                hoist_vars: false,
                conditionals: !debug,
                sequences: !debug,
                booleans: !debug,
                loops: !debug,
                join_vars: !debug,
                comparisons: !debug
            }
        })))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));

    return gulp.src([config.distPath + '/' + config.indexView])
        .pipe(plugins.inject(app, { ignorePath: '/public' }))
        .pipe(gulp.dest(config.distPath, {overwrite: true}));
});

gulp.task('Clean', function () {
    return del([config.distPath]);
});

gulp.task('CopyViews', function () {
    return gulp.src([config.templatesSourcePath])
        .pipe(gulp.dest(config.distPath));
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

gulp.task('buildAppResources', function(cb){
    plugins.sequence('Clean', ['CopyViews', 'CopyMedia', 'CacheTemplates', 'BuildFonts'], 'AppStyles', 'AppScripts')(cb);
});

gulp.task('release', function(cb){
    debug = false;
    plugins.sequence('Clean', ['CopyViews', 'CopyMedia', 'CacheTemplates', 'BuildFonts'], 'AppStyles', 'AppScripts')(cb);
});

gulp.task('watch', ['buildAppResources'], function() {
    gulp.watch('./src/**/*', ['buildAppResources']);
});

/*сборка ng2*/

gulp.task("ng2CopyResources", function(){
    return gulp.src(['./src/templates/index.html', './systemjs.config.js'])
        .pipe(gulp.dest(config.distPath));
});

gulp.task('ng2Scripts', ['ng2Libs'], buildAppScripts);
gulp.task('ng2DevScripts', buildAppScripts);

function buildAppScripts(){
    return gulp.src([
        './typings/index.d.ts',
        './src/scripts/ng2/**/*.ts'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript({
            "outDir": "public/scripts",
            "target": "es5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(config.distPath + config.scriptsDestinationSubPath));
}

gulp.task("ng2Libs", function(){
    return gulp.src([
        'core-js/client/shim.min.js',
        'core-js/client/shim.min.js.map',
        'systemjs/dist/system-polyfills.js',
        'systemjs/dist/system.src.js',
        'reflect-metadata/Reflect.js',
        'reflect-metadata/Reflect.js.map',
        'rxjs/**',
        'zone.js/dist/zone.js',
        '@angular/core/bundles/core.umd.js',
        '@angular/common/bundles/common.umd.js',
        '@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http/bundles/http.umd.js',
        '@angular/router/bundles/router.umd.js',
        '@angular/forms/bundles/forms.umd.js',
        'ui-router-ng2/_bundles/ui-router-ng2.js',
        'ui-router-ng2/_bundles/ui-router-ng2.js.map',
        'howler/dist/howler.js',
        'angular-2-local-storage/dist/*.js',
        'angular-2-local-storage/dist/*.map',
        '@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
        '@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js.map',
    ], {cwd: 'node_modules/**'})
    .pipe(gulp.dest(config.distPath + config.librariesPath));
});

gulp.task("CleanNg2", function(cb){
    return del([
        config.distPath + '/*.*',
        config.distPath + config.scriptsDestinationSubPath,
        config.distPath + config.fontsDestinationSubPath,
        config.distPath + config.styleDestinationSubPath
    ]);
});

gulp.task("ng2FullBuild", ['Clean'], function(cb){
    plugins.sequence('ng2CopyResources', 'BuildFonts', 'AppStyles', 'ng2Scripts')(cb);
});

gulp.task("ng2DevBuild", ['CleanNg2'], function(cb){
    plugins.sequence('ng2CopyResources', 'BuildFonts', 'AppStyles', 'ng2DevScripts')(cb);
});

gulp.task('watchNg2', ['ng2FullBuild'], function() {
    gulp.watch(['./src/scripts/ng2/**/*.ts', './src/styles/**/*.less'], ['ng2DevBuild']);
});