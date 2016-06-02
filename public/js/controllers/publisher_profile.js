angular.module('TinyNewsApp.Controllers').controller('PublisherProfileController', function PublisherProfileController($scope, $rootScope, $location, $route, Alerts,Preload, Publishers) {


    // --
    // Functions
    // --

    /**
     * Update Profile Image
     */
    $scope.save_profile_image = function(img) {
        console.log('New Image:', img);

        Publishers.UpdateInfo(
            $scope.publisher['@rid'],
            { imageUrl: img }
        ).then(
            function(response) {
                $scope.publisher.imageUrl = img;
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

    $scope.publisher = Preload.Get('publisher');
    $scope.meta = Preload.Get('meta');

    if (!$scope.publisher.imageUrl || $scope.publisher.imageUrl == 'undefined') {
        $scope.publisher.imageUrl = '/images/default_publisher.png';
    }

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    })

    $scope.$watch('count', function() {
        console.log('Recount:', $scope.count);
    });
});