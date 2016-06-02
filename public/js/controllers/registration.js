angular.module('TinyNewsApp.Controllers').controller('RegistrationController', function RegistrationController($scope, $rootScope, Alerts, Storage) {

    $scope.user = {};
    $scope.prevent_submit = true;
    $scope.valid_pass = false;
    $scope.processing = false;

    // --
    // Functions
    // --

    $scope.is_valid_pass = function() {
        if ($('#pwd_Reg_Password').val() && $('#pwd_Reg_Password').val().length >= 8 && $scope.user.password && $scope.user.password.length >= 8) {
            $scope.valid_pass = true;
            return true;
        } else {
            $scope.valid_pass = false;
            return false;
        }
    };
    $scope.back = function(){
        window.history.back();
    };


    $scope.submit = function() {
        // Save the form data, so we can restore it in the event of
        // accident.
        var user = angular.copy($scope.user);
        delete user.password;
        Storage.Set(Storage.Type.LOCAL, 'wip_reg_data', user);

        if ($scope.valid_pass) {
            $scope.processing = true;
            Storage.Purge(Storage.Type.LOCAL, 'wip_reg_data');
            return true;
        } else {
            $scope.processing = false;
            return false;
        }
    };

    // --
    // Init
    // --

    // Periodically save the form data (WIP), so we can restore it
    // in the event of accident.
    setInterval(function() {
        var user = angular.copy($scope.user);
        delete user.password;
        Storage.Set(Storage.Type.LOCAL, 'wip_reg_data', user);
    }, 1000);

    // Check for and load any WIP
    var wip = Storage.Get(Storage.Type.LOCAL, 'wip_reg_data');
    if (wip) {
        //Alerts.Signal(Alerts.Type.INFO, 'Looks like you didn\'t quite finish your registration. We\'ve restored the partially completed form for you.');
        for (var i in wip) {
            $scope.user[i] = wip[i];
        }
    }

});