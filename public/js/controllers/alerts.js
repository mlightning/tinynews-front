angular.module('TinyNewsApp.Controllers').controller('AlertsController', function AlertsController($scope, $rootScope, Alerts, Flash) {

    $scope.alerts = [];

    // --
    // Functions
    // --

    $scope.remove = function(alert) {
        alert.status = 1; // Basically acts as deleted
    }

    // --
    // Init
    // --

    // Check for any waiting flash messages
    for (var i in Flash.Type) {
        if (Flash.Exists(Flash.Type[i])) {
            Alerts.Signal(Alerts.GetType(Flash.Type[i]), Flash.Get(Flash.Type[i]));
        }
    }

    // Fetch & Display
    $scope.alerts = Alerts.Fetch();

});