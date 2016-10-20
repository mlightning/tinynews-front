var shared_config = require('./karma-shared.conf');

module.exports = function(config) {
    var conf = shared_config();

    conf.files = conf.files.concat([

        // Our E2E Tests
        'test/frontend/e2e/*.js',
        'test/frontend/e2e/**/*.js'

    ]);

    conf.proxies = {
        '/': 'http://localhost:8080/'
    };

    conf.urlRoot = '/__karma__/';

    conf.frameworks = ['ng-scenario'];

    config.set(conf);
};