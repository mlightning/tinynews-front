exports.config = {
    allScriptsTimeout: 11000,

    seleniumAddress: "http://marius822000.go.ro:4444/wd/hub",

    //Certain actions will cause selenium to fail if it is started using the jar :
    //seleniumServerJar:"/var/tinynews/tinynews-front/node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar",
    specs: [
        './protractor/*.js'
    ],

    capabilities: {
        'browserName': 'chrome'

    },

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
