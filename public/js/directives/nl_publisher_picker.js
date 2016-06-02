angular.module('TinyNewsApp.Directives').directive('nlPublisherPicker', function ($rootScope, Alerts) {
    return {
        restrict: 'E',
        templateUrl: NL_WEB_HOST + 'js/views/nl_publisher_picker.html',
        scope: { callback: '&' },
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            /**
             * Finishes the selection process, and applies the
             * selected value to the ngModel value.
             */
            scope.finish = function() {
                ctrl.$setViewValue(scope.selected);
                $('#nl_publisher_picker').modal('hide');

                if (scope.callback && typeof scope.callback == 'function') {
                    scope.callback({ publisher: scope.selected });
                }
            }

        },
        controller: function($scope, Publishers) {

            $scope.publishers = [];
            $scope.selected = false;

            // --
            // Methods
            // --

            /**
             * Queues the clicked value as selected.
             *
             * @param   Publisher   publisher   Clicked Publisher object
             */
            $scope.select = function(publisher) {
                $scope.publishers.forEach(function(item) {
                    item.selected = false;
                });

                publisher.selected = true;
                $scope.selected = publisher;
                return false;
            }

            /**
             * Shows the Publisher Creator
             */
            $scope.show_pub_creator = function() {
                $('#nl_publisher_picker').modal('hide');
                $('#nl_publisher_creator').modal('show');
                return false;
            }

            // --
            // Init
            // --

            Publishers.Search().then(
                function(publishers) {
                    $scope.publishers = publishers;
                },
                function(message) {
                    console.log(message);
                    Alerts.Signal(Alerts.Type.ERROR, 'There was a problem searching publishers.');
                }
            );
        }
    }
});
