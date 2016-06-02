angular.module('TinyNewsApp.Directives').directive('nlFeedEntry', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { article: '=article' },
        templateUrl: '/js/views/nl_feed_entry.html',
        link: function (scope, element, attrs) {

        },
        controller: function($scope) {

            // ~~

            // --
            // Methods
            // --

            $scope.toggle = function() {
                $scope.article.is_open = !$scope.article.is_open;
            }

            // --
            // Init
            // --

            // ~~

        }
    }
});
