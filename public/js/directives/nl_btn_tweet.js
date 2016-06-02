angular.module('TinyNewsApp.Directives').directive('nlBtnTweet', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            setTimeout(function() {
                twttr.widgets.createShareButton(
                    attrs.url,
                    element[0],
                    function(el) {}, {
                        count: 'right',
                        text: attrs.text,
                        align: 'right'
                    }
                );
            });
        }
    }
});
