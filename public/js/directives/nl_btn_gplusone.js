angular.module('TinyNewsApp.Directives').directive('nlBtnGplusone', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function() {
                gapi.plusone.render(
                    attrs.id,
                    {
                        size: 'medium',
                        count: true,
                        annotation: 'bubble',
                        href: attrs.url,
                        align: 'right'
                    }
                );
            });
        }
    }
});
