module.exports = function() {
    var root = './';
    var clientApp = root + 'app/';
    var build = './build/';
    
    var config = {
        root: root,
        app: clientApp,
        js: {
            all: build + '**/*.js',
            appFiles: [
                build + '**/*.js',
                '!' + build + '**/*.spec.js',
                '!' + build + '**/*.mock.js',
                '!' + build + '**/*.test.js'
            ],
            order: [
                '**/*.js'
            ]
        },
        ts: {
            allDtsFilePath: clientApp + 'typings/_all.d.ts',
            allTs: clientApp + '**/*.ts',
            libTypingsAllTs: root + 'typings/main/**/*.ts'
        },
        build: {
            output: build
        }
    }

    return config;
}