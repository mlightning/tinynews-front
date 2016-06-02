angular.module('TinyNewsApp.Controllers').controller('SearchResultsController', function SearchResultsController($scope, $rootScope, Preload) {

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

    console.log('Init SearchResultsController');

    if (Preload.Get('query')) {
        $scope.query = Preload.Get('query');
    }

});