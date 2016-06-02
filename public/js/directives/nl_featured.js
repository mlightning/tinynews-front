angular.module('TinyNewsApp.Directives').directive('nlFeatured', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { article: '=article' },
        template: '<button ng-if="!hide" class="btn" ng-class="{ \'btn-success\': !featured, \'btn-primary\': featured }" ng-click="toggle_featured()">{{ (featured) ? "FEATURED" : "NOT FEATURED" }}</button>',
        link: function (scope, element, attrs, ctrl) {

        },
        controller: function($scope, Articles, Alerts) {

            // --
            // Methods
            // --

            $scope.toggle_featured = function() {
                if ($scope.article.featured) {
                    $scope.article.featured = 0;
                    Articles.Update($scope.article).then(
                        function() {
                            $scope.featured = 0;
                        },
                        function() {
                            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem while updating the article.');
                        }
                    )
                } else {
                    // Feature
                    $scope.article.featured = 1;
                    Articles.Update($scope.article).then(
                        function() {
                            $scope.featured = 1;
                        },
                        function() {
                            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem while updating the article.');
                        }
                    )
                }
            }

            // --
            // Init
            // --

            $scope.featured = $scope.article.featured;
        }
    }
});
