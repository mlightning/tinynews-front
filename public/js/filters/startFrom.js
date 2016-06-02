angular.module('TinyNewsApp.Filters').filter('startFrom', function() {
    return function(input, start) {         
        return input.slice(start);
    };
});