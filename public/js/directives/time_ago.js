angular.module('TinyNewsApp.Directives').directive('timeAgo', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { time: '=time' },
        template: '<small ng-bind="text"></small>',
        link: function (scope, element, attrs, ctrl) {

        },
        controller: function($scope) {

            // ~~

            // --
            // Init
            // --

            $scope.text = moment.unix($scope.time).fromNow();

            setInterval(function() {
                var old = $scope.text;
                $scope.text = moment.unix($scope.time).fromNow();
                if ($scope.text != old) {
                    $scope.$apply();
                }
            }, 2000);

        }
    }
});
