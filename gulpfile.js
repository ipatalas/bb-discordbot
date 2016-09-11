/// <reference path="typings/index.d.ts" />

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var config = require('./gulp.config.js')();
 
var tsProject = ts.createProject('tsconfig.json');
 
gulp.task('ts', function() {
    var tsResult = tsProject.src(config.ts.allTs)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest(config.build.output));
});
 
gulp.task('ts-lint', function () {
    return gulp.src(config.ts.allTs)
        .pipe(tslint({formatter: "prose"}))
        .pipe(tslint.report());
});

gulp.task('clean', function (cb) {
    return gulp.src(config.js.all, {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch([config.ts.allTs], ['ts-lint', 'ts']);
});

gulp.task('default', function(cb) {
    runSequence('ts-lint', 'ts', cb);
});