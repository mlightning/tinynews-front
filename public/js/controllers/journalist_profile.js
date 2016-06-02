angular.module('TinyNewsApp.Controllers').controller('JournalistProfileController', function JournalistProfileController($scope, $rootScope, $location, $route, Alerts, Preload, Journalists) {

    $scope.editing = {};

    // --
    // Functions
    // --

    /**
     * Update Profile Image
     */
    $scope.save_profile_image = function(img) {
        console.log('New Image:', img);

        Journalists.UpdateInfo(
            $scope.journalist['@rid'],
            { imageUrl: img }
        ).then(
            function(response) {
                $scope.journalist.imageUrl = img;
                Alerts.Signal(Alerts.Type.SUCCESS, 'Profile image updated.');
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating your profile image.');
            }
        );
    }

    // --
    // Init
    // --

    $scope.journalist = Preload.Get('journalist');
    $scope.meta = Preload.Get('meta');

    if (!$scope.journalist.imageUrl || $scope.journalist.imageUrl == 'undefined') {
        $scope.journalist.imageUrl = '/images/default_journalist.png';
    }

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    });

    $scope.$watch('count', function() {
        console.log('Recount:', $scope.count);
    });

});