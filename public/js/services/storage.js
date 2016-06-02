angular.module('TinyNewsApp.Services')
    .service('Storage', function ($rootScope) {

        // --
        // Properties
        // --

        // ~~

        // --
        // Private Service Methods
        // --

        var _exists = function(type) {
            return (window[type]) ? true : false;
        }

        // --
        // Init
        // --

        return {

            Type: {
                LOCAL: 'localStorage',
                SESSION: 'sessionStorage'
            },

            // --
            // Public Service Methods
            // --

            Get: function(type, key) {
                if (_exists(type)) {
                    return JSON.parse(window[type].getItem(key));
                } else {
                    return false;
                }
            },

            Set: function(type, key, val) {
                if (_exists(type)) {
                    window[type].setItem( key, JSON.stringify(val) );
                }
            },

            Purge: function(type, key) {
                if (_exists(type)) {
                    return window[type].removeItem(key);
                }
            }

        }
    });