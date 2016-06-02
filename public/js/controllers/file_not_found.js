angular.module('TinyNewsApp.Controllers').controller('FileNotFoundController', function FileNotFoundController($scope, $rootScope) {

    // ~~

    // --
    // Functions
    // --

    $scope.do_search = function() {
        window.location = NL_WEB_HOST + 'search?query=' + encodeURIComponent($scope.query);
        return false;
    }

    // --
    // Init
    // --

    console.log('Init FileNotFoundController');

});