angular.module('TinyNewsApp.Controllers').controller('AccountSettingsController', function AccountSettingsController($scope, $rootScope, $location, $route, Alerts, Preload, Users) {

    $scope.editing = {};
    $scope.newbg_entry = {};

    // --
    // Functions
    // --

    /**
     * Change the User's password
     */
    $scope.change_password = function() {
        Users.UpdateInfo(
            $scope.editing['@rid'],
            { password: $scope.editing.password }
        ).then(
            function(response) {
                Alerts.Signal(Alerts.Type.SUCCESS, 'Password changed.');
                $scope.pwdch.$setPristine();
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating your password.');
            }
        );
    };

    /**
     * Save Personal Info
     */
    $scope.save_info = function() {
        Users.UpdateInfo(
            $scope.editing['@rid'],
            $scope.editing
        ).then(
            function(response) {
                Alerts.Signal(Alerts.Type.SUCCESS, 'Information updated.');
                $scope.info.$setPristine();
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating your information.');
            }
        );
    }

    /**
     * Add a Background Entry
     */
    $scope.add_background = function() {
        var now = parseInt(new Date().getTime() / 1000);
        $scope.newbg_entry.creation_date = now;
        $scope.newbg_entry.modification_date = now;

        $scope.backgrounds.push($scope.newbg_entry);

        Users.UpdateProfile(
            $scope.editing['@rid'],
            { userBackground: $scope.backgrounds }
        ).then(
            function(response) {
                $scope.backgrounds = response.userBackground;

                $scope.newbg_entry = {};
                $scope.newbg.$setPristine();
                Alerts.Signal(Alerts.Type.SUCCESS, 'Background information updated.');
                $scope.info.$setPristine();
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating your background information.');
            }
        );
    }

    /**
     * Remove background Entry
     */
    $scope.remove_background = function(entry) {
        for (var i in $scope.backgrounds) {
            if ($scope.backgrounds[i]['@rid'] == entry['@rid']) {
                $scope.backgrounds.splice(i, 1);

                Users.UpdateProfile(
                    $scope.editing['@rid'],
                    { userBackground: $scope.backgrounds }
                ).then(
                    function(response) {
                        $scope.backgrounds = response.userBackground;
                        $scope.newbg.$setPristine();
                        Alerts.Signal(Alerts.Type.SUCCESS, 'Background entry removed.');
                        $scope.info.$setPristine();
                    },
                    function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating your background information.');
                    }
                );
            }
        }
    }

    // --
    // Init
    // --

    $scope.editing = Preload.Get('user');
    $scope.backgrounds = $scope.editing.profile.userBackground;

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    })

});