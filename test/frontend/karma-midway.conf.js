var shared_config = require('./karma-shared.conf.js');

module.exports = function(config) {
    var conf = shared_config();

    conf.files = conf.files.concat([

        // Mocha Config for browser tests
        'test/frontend/mocha.conf.js',

        // Our Midway Tests
        'test/frontend/midway/*.js',
        'test/frontend/midway/**/*.js'

    ]);

    conf.proxies = {
        '/': 'http://localhost:9999'
    }

    config.set(conf);
}