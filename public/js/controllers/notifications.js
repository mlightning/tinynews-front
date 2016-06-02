angular.module('TinyNewsApp.Controllers').controller('NotificationsController', function NotificationsController($scope, $rootScope, ActiveUser) {

    $scope.notifications = [];

    // --
    // Functions
    // --

    // ~~

    // --
    // Init
    // --

    $scope.$on('socket_available', function() {
        ActiveUser.Subscribe('notifications_' + ActiveUser.Get('user')['@rid']);
    });

});