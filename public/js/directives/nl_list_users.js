angular.module('TinyNewsApp.Directives').directive('nlListUsers', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

    var get_template = function(viewType) {
        return $http.get('/js/views/users/' + viewType + '.html', { cache: $templateCache });
    }

    return {
        restrict: 'E',
        scope: false,
        link: function(scope, element, attrs) {
            var redraw = function () {
                var loader = get_template(scope.current_view_type);

                loader
                    .success(function(html) {
                        element.html(html);
                    })
                    .then(function(response) {
                        $compile(element.contents())(scope);
                    });
            };

            redraw();

            scope.$watch('current_view_type', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                } else {
                    redraw();
                }
            }, true);
            
        }
    };
}]);