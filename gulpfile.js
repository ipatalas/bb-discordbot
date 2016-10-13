/// <reference path="typings/index.d.ts" />

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
	rename: {
		"gulp-ssh": "GulpSSH"
	}
});

const runSequence = require('run-sequence');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
const JasmineConsoleReporter = require('jasmine-console-reporter');

const config = require('./gulp.config.js')();
const tsProject = $.typescript.createProject('tsconfig.json');

gulp.task('ts', () => {
	var tsResult = tsProject.src(config.ts.allTs)
		.pipe($.sourcemaps.init())
		.pipe(tsProject());

	return tsResult.js
		.pipe($.sourcemaps.write(".", { sourceRoot: "." }))
		.pipe(gulp.dest(config.build.output));
});

gulp.task('ts-lint', () => {
	return gulp.src(config.ts.allTs)
		.pipe($.tslint({ formatter: "prose" }))
		.pipe($.tslint.report());
});

gulp.task('clean', function (cb) {
	return gulp.src(config.build.output, { read: false })
		.pipe($.clean());
});

gulp.task('tests:cover:before', ['ts'], function () {
	return gulp.src(config.js.appFiles)
		.pipe($.istanbul())
		.pipe($.istanbul.hookRequire());
});

gulp.task('tests', ['ts'], () => {
	// this reporter caches failing specs, so it has to be created every time
	const reporter = new JasmineConsoleReporter();

	return gulp.src(config.js.tests)
		.pipe($.jasmine({ reporter: reporter }));
});

gulp.task('tests:cover', ['tests:cover:before', 'ts'], () => {
	// this reporter caches failing specs, so it has to be created every time
	const reporter = new JasmineConsoleReporter();

	return gulp.src(config.js.tests)
		.pipe($.jasmine({ reporter: reporter }))
		.pipe($.istanbul.writeReports({
			reporters: ['json']
		})).on('end', remapCoverageFiles);
});

gulp.task('fixCoveragePaths', () => {
	return gulp.src(config.coverage.lcovPath)
		.pipe($.replace(/SF:.*build\//, `SF:${config.appRelative}`))
		.pipe(gulp.dest(config.coverage.path));
});

gulp.task('tests:watch', ['ts'], () => {
	return gulp.watch(config.ts.allTs, ['ts', 'tests']);
});

gulp.task('tests:cover:watch', ['ts'], () => {
	return gulp.watch(config.ts.allTs, ['ts', 'tests:cover']);
});

gulp.task('watch', () => {
	gulp.watch(config.ts.allTs, ['ts']);
});

gulp.task('develop', ['ts', 'watch'], () => {
	var spawn = require("child_process").spawn, bunyan;

	$.nodemon({
		script: config.build.main,
		ignore: "operations.json",
		nodeArgs: ['--debug'],
		env: {
			NODE_ENV: "development"
		},
		stdout: false,
		readable: false
	}).on('readable', () => {
		// free memory 
		bunyan && bunyan.kill()

		bunyan = spawn('node', [
			'./node_modules/bunyan/bin/bunyan',
			'--output', 'short',
			'--color'
		]);

		bunyan.stdout.pipe(process.stdout)
		bunyan.stderr.pipe(process.stderr)

		this.stdout.pipe(bunyan.stdin)
		this.stderr.pipe(bunyan.stdin)
	});
});

gulp.task('_deployFiles', [], () => {
	const deploy = require("./deploy.json");
	const gulpSSH = new $.GulpSSH({
		ignoreErrors: false,
		sshConfig: deploy.ssh
	});

	return gulp
		.src(config.build.allFiles)
		.pipe(gulpSSH.dest(deploy.destination));
});

gulp.task('_copyDeps', () => {
	return gulp.src($.npmFiles(), { base: './' })
		.pipe(gulp.dest(config.build.output));
});

gulp.task('_copyFiles', () => {
	return gulp.src(config.copyFiles)
		.pipe(gulp.dest(config.build.output));
});

gulp.task('_replaceConfigPath', () => {
	return gulp.src(config.build.config)
		.pipe($.replace('../config.json', './config.json'))
		.pipe(gulp.dest(config.build.output));
});

gulp.task('build', function (cb) {
	runSequence('clean', 'ts-lint', 'ts', '_copyFiles', '_replaceConfigPath', '_copyDeps', cb);
});

gulp.task('deploy', function (cb) {
	runSequence('clean', 'ts-lint', 'ts', '_copyFiles', '_replaceConfigPath', '_copyDeps', '_deployFiles', cb);
});

gulp.task('default', function (cb) {
	runSequence('ts-lint', 'ts', cb);
});

function remapCoverageFiles() {
	return gulp.src('./coverage/coverage-final.json')
		.pipe(remapIstanbul({
			reports: {
				'html': './coverage',
				'text-summary': null,
				'lcovonly': './coverage/lcov.info'
			}
		}));
}