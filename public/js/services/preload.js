angular.module('TinyNewsApp.Services')
    .service('Preload', function($rootScope) {

        // --
        // Properties
        // --

        if (typeof NL_PRELOAD_DATA == 'undefined') {
            var data = {};
        } else {
            var data = NL_PRELOAD_DATA; // From the Document
        }

        return {

            // --
            // Public Service Methods
            // --

            Get: function(index) {
                return data[index] || false;
            }

        }
    })