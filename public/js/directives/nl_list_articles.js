angular.module('TinyNewsApp.Directives').directive('nlListArticles', function($compile, $http, $templateCache) {
    return {
        restrict: 'E',
        scope: {
            items: '=items'
        },
        link: function(scope, element, attrs) {

            scope.$watch('items', function(newValue, oldValue) {
                element.html($templateCache.get('nl_list_articles.html'));
                $compile(element.contents())(scope);
            }, true);

        }
    };
});