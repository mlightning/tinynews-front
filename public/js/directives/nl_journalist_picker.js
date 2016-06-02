angular.module('TinyNewsApp.Directives').directive('nlJournalistPicker', function ($rootScope, Alerts) {
    return {
        restrict: 'E',
        templateUrl: '/js/views/nl_journalist_picker.html',
        scope: { callback: '&' },
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            /**
             * Finishes the selection process, and applies the
             * selected value to the ngModel value.
             */
            scope.finish = function() {
                ctrl.$setViewValue(scope.selected);
                $('#nl_journalist_picker').modal('hide');

                if (scope.callback && typeof scope.callback == 'function') {
                    scope.callback({ journalist: scope.selected });
                }
            }

        },
        controller: function($scope, Journalists) {

            $scope.journalists = [];
            $scope.selected = false;

            // --
            // Methods
            // --

            /**
             * Queues the clicked value as selected.
             *
             * @param   Journalist   journalist   Clicked Journalist object
             */
            $scope.select = function(journalist) {
                $scope.journalists.forEach(function(item) {
                    item.selected = false;
                });

                journalist.selected = true;
                $scope.selected = journalist;
                return false;
            }

            // --
            // Init
            // --

            Journalists.Search().then(
                function(journalists) {
                    $scope.journalists = journalists;
                },
                function(message) {
                    console.log(message);
                    Alerts.Signal(Alerts.Type.ERROR, 'There was a problem searching journalists.');
                }
            );
        }
    }
});
