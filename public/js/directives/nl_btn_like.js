angular.module('TinyNewsApp.Directives').directive('nlBtnLike', function ($window, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function() {
                $window.FB.XFBML.parse(element[0]);
            });
        }
    }
});
