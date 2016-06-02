angular.module('TinyNewsApp.Controllers').controller('UserProfileController', function UserProfileController($scope, $rootScope, Alerts, Preload, Users) {

    $scope.editing = {};

    // --
    // Functions
    // --

    // ~~

    /**
     * Update Profile Image
     */
    $scope.save_profile_image = function(img) {
        console.log('New Image:', img);

        Users.UpdateInfo(
            $scope.editing['@rid'],
            { imageUrl: img }
        ).then(
            function(response) {
                $scope.editing.imageUrl = img;
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

    $scope.editing = Preload.Get('user');

});