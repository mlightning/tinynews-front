angular.module('TinyNewsApp.Controllers').controller('AboutUsController', function AboutUsController($scope, $rootScope, $location, $route, Alerts) {

    // --
    // Init
    // --
	
    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    })

});