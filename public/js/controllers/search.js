angular.module('TinyNewsApp.Controllers').controller('SearchController', function SearchController($scope, $rootScope) {

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

    console.log('Init SearchController');

});