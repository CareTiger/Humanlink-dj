var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var del = require('del');
var gulp   = require('gulp');
var less = require('gulp-less');
minifyCss = require('gulp-minify-css');
var watch = require('gulp-watch');

var bundleJs = function (files, filename, annotate) {
    var g = gulp.src(files);
    g = g.pipe(concat(filename));
    if (annotate) {
        g = g.pipe(ngAnnotate({add: true}));
    };
    return g.pipe(gulp.dest('webapp/static/js/'));
};

gulp.task('move-bootstrap', function () {
    return gulp.src('bower_components/bootstrap/less/**/*.less')
        .pipe(gulp.dest('webapp/static/less/bootstrap/'));
});

gulp.task('move-fonts', function () {
    return gulp.src([
        'bower_components/bootstrap/fonts/*',
        'bower_components/font-awesome/fonts/*'
    ])
        .pipe(gulp.dest('webapp/static/fonts/'));
});

gulp.task('js', function(){
	return bundleJs([
        'app/app.js',
        'app/*.js',
        'app/**/*module.js',
        'app/**/*directives.js',
        'app/**/*service.js',
        'app/**/*.js',
        'app/**/**/*.js'
    ], 'humanlink.js', true);
});

gulp.task('cv', function () {
    del.sync(['static/js/vendor.*.js']);
    return bundleJs([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-scroll-glue/src/scrollglue.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/checklist-model/checklist-model.js',
        'bower_components/underscore/underscore-min.js',
        'bower_components/moment/moment.js',
        'bower_components/pusher-websocket-iso/dist/web/pusher.js',
        'bower_components/angular-cookies/angular-cookies.js'
    ], 'vendor.js', false);
});

gulp.task('less', ['move-bootstrap', 'move-fonts'], function () {
    del.sync(['static/css/humanlink.css']);
    return gulp.src([
        'webapp/static/less/humanlink.less',
        'bower_components/font-awesome/css/font-awesome.min.css'
    ])
        .pipe(less())
        .pipe(concat('humanlink.css'))
        .pipe(gulp.dest('webapp/static/css/'));
});

gulp.task('watch', function(){
  gulp.watch('app/**/*.js', ['js']);
  gulp.watch('webapp/static/less/**/*.less', ['less']);
  // Other watchers
})

gulp.task('default', ['js', 'less', 'cv', 'watch']);