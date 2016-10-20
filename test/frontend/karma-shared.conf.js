module.exports = function(config) {
    return {
        basePath: '../../',
        frameworks: ['mocha'],
        reporters: ['mocha'],
        browsers: ['PhantomJS'],
        autoWatch: true,
        singleRun: true,
        colors: true,

        files: [
            // Angular
            'public/components/angular/angular.js',
            'public/components/angular-*/angular-*.js',

            // Our Application Code
            'public/js/*.js',
            'public/js/**/*.js',
            'public/js/**/**/*.js',

            // Helper Modules
            'node_modules/should/should.js',
            'node_modules/ng-midway-tester/src/ngMidwayTester.js'
        ]

    }
}