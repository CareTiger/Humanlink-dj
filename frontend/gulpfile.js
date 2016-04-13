'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    del = require('del'),
    templateCache = require('gulp-angular-templatecache');

var paths = {
    bower: 'bower_components',
    js: 'app/**/*.js',
    less: 'assets/stylesheets/less/**/*.less',
    templates: 'views/*/partials/**/*.html'
};

var bundleJs = function (files, filename, annotate) {
    var g = gulp.src(files);
    g = g.pipe(concat(filename));
    if (annotate) {
        g = g.pipe(ngAnnotate({add: true}));
    }
    g = g.pipe(uglify());
    return g.pipe(gulp.dest('static/js/'));
};

gulp.task('compile-templates', function () {
    del.sync(['static/js/templates.*.js']);
    return gulp.src('views/*/partials/**/*.html')
        .pipe(templateCache('templates.js', {
            standalone: true,
            root: '/views/',
            moduleSystem: 'IIFE'}))
        .pipe(gulp.dest('static/js/'));
});

gulp.task('move-bootstrap', function () {
    return gulp.src(paths.bower + '/bootstrap/less/**/*.less')
        .pipe(gulp.dest('assets/stylesheets/less/bootstrap/'));
});

gulp.task('move-fonts', function () {
    return gulp.src([
        paths.bower + '/bootstrap/fonts/*',
        paths.bower + '/fontawesome/fonts/*'
    ])
        .pipe(gulp.dest('static/fonts/'));
});

gulp.task('compile-less', ['move-bootstrap', 'move-fonts'], function () {
    del.sync(['static/css/humanlink.*.css']);
    return gulp.src([
        'assets/stylesheets/less/humanlink.less',
        paths.bower + '/fontawesome/css/font-awesome.min.css'
    ])
        .pipe(less())
        .pipe(concat('humanlink.css'))
        .pipe(minifyCss({processImport: false}))
        .pipe(gulp.dest('static/css/'));
});

gulp.task('compile-vendor', function () {
    del.sync(['static/js/vendor.*.js']);
    var bower = paths.bower;
    return bundleJs([
        bower + '/jquery/dist/jquery.js',
        bower + '/bootstrap/dist/js/bootstrap.js',
        bower + '/angular/angular.js',
        bower + '/angular-animate/angular-animate.min.js',
        bower + '/angular-bootstrap/ui-bootstrap-tpls.js',
        bower + '/angular-messages/angular-messages.min.js',
        bower + '/angular-sanitize/angular-sanitize.js',
        bower + '/angular-scroll-glue/src/scrollglue.js',
        bower + '/angular-ui-router/release/angular-ui-router.js',
        bower + '/checklist-model/checklist-model.js',
        bower + '/underscore/underscore-min.js',
        bower + '/moment/moment.js',
        bower + '/pusher/dist/pusher.min.js'
    ], 'vendor.js', false);
});

gulp.task('compile-js', function () {
    del.sync(['static/js/humanlink.*.js']);
    return bundleJs([
        'app/app.js',
        'app/*.js',
        'app/**/*module.js',
        'app/**/*.js'
    ], 'humanlink.js', true);
});

gulp.task('compile', ['compile-less', 'compile-vendor', 'compile-js', 'compile-templates'],
        function () {
    // Do nothing.
});

gulp.task('watch', ['compile'], function () {
    gulp.watch(paths.js, ['compile-js']);
    gulp.watch(paths.less, ['compile-less']);
    gulp.watch(paths.templates, ['compile-templates']);
});

gulp.task('default', ['watch'], function () {
    // Do nothing.
});