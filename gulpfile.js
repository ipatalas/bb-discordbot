/// <reference path="typings/index.d.ts" />

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');
var gnf = require('gulp-npm-files');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

var config = require('./gulp.config.js')();

var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function () {
	var tsResult = tsProject.src(config.ts.allTs)
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject));

	return tsResult.js
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(config.build.output));
});

gulp.task('ts-lint', function () {
	return gulp.src(config.ts.allTs)
		.pipe(tslint({ formatter: "prose" }))
		.pipe(tslint.report());
});

gulp.task('clean', function (cb) {
	return gulp.src(config.build.output, { read: false })
		.pipe(clean());
});

gulp.task('watch', function() {
	gulp.watch(config.ts.allTs, ['ts']);
});

gulp.task('develop', ['ts', 'watch'], function() {
	nodemon({
		script: config.build.main,
		nodeArgs: ['--debug']
	});
});

gulp.task('_copyDeps', function() {
	gulp.src(gnf(), {base:'./'})
		.pipe(gulp.dest(config.build.output));
});

gulp.task('build', function(cb) {
	runSequence('clean', 'ts-lint', 'ts', '_copyDeps', cb);
});

gulp.task('default', function (cb) {
	runSequence('ts-lint', 'ts', cb);
});