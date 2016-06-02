angular.module('TinyNewsApp.Controllers').controller('GroupProfileController', function GroupProfileController($scope, $rootScope, $location, $route, Alerts, Preload, Groups,Users) {
    $scope.editing = {};
    // --
    // Functions
    // --

    /**
     * Update Profile Image
     */
    $scope.save_profile_image = function(img) {
    }

    // --
    // Init
    // --
    $scope.group = Preload.Get('group');
    $scope.meta = Preload.Get('meta');
    console.log('group>',$scope.group);
    console.log('meta>',$scope.meta);
    if (!$scope.group.imageUrl || $scope.group.imageUrl == 'undefined') {
        $scope.group.imageUrl = '/images/default_user.png';
    }

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    });

    $scope.$watch('count', function() {
        console.log('Recount:', $scope.count);
    });
 
});