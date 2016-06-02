angular.module('TinyNewsApp.Directives').directive('nlPublisherCreator', function ($rootScope, Publishers, Alerts) {
    return {
        restrict: 'E',
        templateUrl: NL_WEB_HOST + 'js/views/nl_publisher_creator.html',
        scope: { callback: '&' },
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            /**
             * Finishes the selection process, and applies the
             * selected value to the ngModel value.
             */
            scope.finish = function() {
                ctrl.$setViewValue(angular.copy(scope.editing));
                $('#nl_publisher_creator').modal('hide');

                if (scope.callback && typeof scope.callback == 'function') {
                    scope.callback({ publisher: ctrl.$viewValue });
                }
            }

            // Init

            scope.$watch(attrs.ngModel, function(new_val, old_val) {
                console.log('Pub Creator - Model Change:', new_val, old_val);
                if (new_val) {
                    scope.mode = 'edit';
                }
            });

        },
        controller: function($scope, Publishers) {

            $scope.mode = 'save'; // Optionally 'edit'

            $scope.publisher = {};
            $scope.selected = false;

            // --
            // Methods
            // --

            /**
             * Queues the clicked value as selected.
             */
            $scope.save_publisher = function() {
                console.log('submit');
                Publishers.Save($scope.editing).then(
                    function(data) {
                        $scope.editing = data;
                        $scope.finish();
                        Alerts.Signal(Alerts.Type.SUCCESS, 'Publisher created.');
                    },
                    function(data) {
                        console.log(data);
                        Alerts.Signal(Alerts.Type.ERROR, 'There was a problem saving the publisher.');
                    }
                );
            }

            // --
            // Init
            // --

            // ~~
        }
    }
});
