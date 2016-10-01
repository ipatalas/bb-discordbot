/// <reference path="typings/index.d.ts" />

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');
var gnf = require('gulp-npm-files');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var GulpSSH = require('gulp-ssh')
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

var config = require('./gulp.config.js')();
var tsProject = ts.createProject('tsconfig.json');

var gulpSSH = new GulpSSH({
	ignoreErrors: false,
	sshConfig: config.deploy.ssh
})

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

gulp.task('watch', function () {
	gulp.watch(config.ts.allTs, ['ts']);
});

gulp.task('develop', ['ts', 'watch'], function () {
	nodemon({
		script: config.build.main,
		ignore: "operations.json",
		//verbose: true,
		nodeArgs: ['--debug'],
		env: {
			NODE_ENV: "development"
		}
	});
});

gulp.task('_deployFiles', [], function () {
	return gulp
		.src(config.build.allFiles)
		.pipe(gulpSSH.dest(config.deploy.destination));
});

gulp.task('_copyDeps', function () {
	return gulp.src(gnf(), { base: './' })
		.pipe(gulp.dest(config.build.output));
});

gulp.task('_copyFiles', function () {
	return gulp.src(config.copyFiles)
		.pipe(gulp.dest(config.build.output));
});

gulp.task('_replaceConfigPath', function () {
	return gulp.src(config.build.main)
		.pipe(replace('../config.json', './config.json'))
		.pipe(gulp.dest(config.build.output));
});

// TODO: 
// - convert new lines

gulp.task('_archive', function () {
	return gulp.src(config.build.allFiles)
		.pipe(tar(config.build.archiveName + ".tar"))
		.pipe(gzip())
		.pipe(gulp.dest(config.root));
});

gulp.task('build', function (cb) {
	runSequence('clean', 'ts-lint', 'ts', '_copyFiles', '_replaceConfigPath', '_copyDeps', '_archive', cb);
});

gulp.task('deploy', function (cb) {
	runSequence('clean', 'ts-lint', 'ts', '_copyFiles', '_replaceConfigPath', '_copyDeps', '_deployFiles', cb);
});

gulp.task('default', function (cb) {
	runSequence('ts-lint', 'ts', cb);
});