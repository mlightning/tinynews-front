'use strict';

// ----------------
//   Dependencies
// ----------------

var fs                          = require('fs');
var Config                      = require('../config.json');
var Core                        = require('tinynews-common');

// --
// Stored Stuff
// --

var assets = {
    js: [],
    css: []
}

// --
// Helpers
// --

var crawl = function(dir, type) {
    var root = fs.readdirSync(dir);

    for (var i in root) {
        var file = dir + '/' + root[i];
        var meta = fs.statSync(file);
        if (meta && meta.isDirectory()) {
            crawl(file, type);
        } else {
            if (file.indexOf('.' + type) >= 1) {
                assets[type].push( file.replace('./public', '') );
            }
        }
    }
}

// --
// Init
// --

crawl('./public/js', 'js');
crawl('./public/css', 'css');

assets.js.sort(function(a, b) {
    return a.length - b.length;
})

module.exports = {

    /**
     * Issue a token for the user
     *
     * @param    string    type     Asset type
     * @return   array              Array of assets
     **/
    GetAssets: function(type) {
        return assets[type];
    }
}