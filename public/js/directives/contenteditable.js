angular.module('TinyNewsApp.Directives').directive('contenteditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            // view -> model
            element.bind('blur change', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(element.html());
                });
            });

            // model -> view
            ctrl.$render = function() {
                element.html(ctrl.$viewValue);
            };

            // load init value from DOM
            ctrl.$render();
        }
    };
});