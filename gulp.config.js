module.exports = function () {
	var root = './';
	var clientApp = root + 'app/';
	var build = './build/';
	var coveragePath = './coverage';
	var pkg = require('./package.json');

	var archiveName = pkg.name + '-v' + pkg.version;

	var config = {
		root: root,
		app: clientApp,
		js: {
			all: build + '**/*.js',
			tests: [
				build + '**/spec/*.[Ss]pec.js'
			],
			appFiles: [
				build + '**/*.js',
				'!' + build + 'node_modules/**/*.js',
				'!' + build + '**/*.spec.js',
				'!' + build + '**/*.mock.js',
				'!' + build + '**/*.test.js'
			]
		},
		ts: {
			allTs: clientApp + '**/*.ts'
		},
		copyFiles: [
			'./config.json'
		],
		build: {
			output: build,
			main: build + 'main.js',
			config: build + 'config.js',
			allFiles: [
				build + '**/*',
				'!' + build + '**/*.js.map'
			]
		},
		coverage: {
			path: coveragePath,
			lcovPath: `${coveragePath}/lcov.info`
		}
	}

	return config;
}