angular.module('TinyNewsApp.Directives').directive('nlArticleCard', function ($rootScope, $compile, $templateCache) {
    return {
        restrict: 'EA',
        scope: {
            article: '=article',
            template: '@template'
        },
        link: function (scope, element, attrs) {
            if (attrs.template) {
                element.html($templateCache.get(attrs.template)).show();
            } else {
                element.html($templateCache.get('nl_article_card.html')).show();
            }

            $compile( element.contents() )(scope);
        },
        controller: function($scope, Articles, Alerts) {

            $scope.calc_avg_rating = function() {
                var total=0;
                for (key in $scope.article.rating) {
                    total+=$scope.article.rating[key];
                }
                var rating = (total/4);

                $scope.avg_rating = rating;
            }

            // --
            // Methods
            // --

            // --
            // Init
            // --

            $scope.calc_avg_rating();

        }
    }
});
