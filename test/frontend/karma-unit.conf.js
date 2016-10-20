var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
    var conf = sharedConfig();

    conf.files = conf.files.concat([
        //extra testing code
        'public/components/angular-mocks/angular-mocks.js',

        //mocha stuff
        'test/frontend/mocha.conf.js',

        //test files
        './test/frontend/unit/*.js'
    ]);

    config.set(conf);
};