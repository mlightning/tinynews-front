angular.module('TinyNewsApp.Directives').directive('nlRangeSlider', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            value: "=value",
            min: "@min",
            max: "@max",
            step: "@step",
            name:   "@name"
        },
        template:
            '<input id="{{ name }}" type="text" name="{{ name }}" value="{{ value }}" ng-cloak/><br />',
        link: function (scope, element, attrs) {

            // --
            // Events
            // --

            scope.$watch('value', function(new_val, old_val) {
                    scope.input_el.ionRangeSlider("update", {from: new_val});
            });

            // --
            // Methods
            // --

            scope.update = function(o) {
                scope.$apply(function() {
                    scope.value = o.fromNumber;
                });
            }

            scope.init = function() {
                scope.input_el=$(element.find('input'));
                scope.input_el.ionRangeSlider({ type: "single", step: scope.step, from: scope.value, hideText: true, min: scope.min, max: scope.max, onFinish: function(e){ scope.update(e)} });
            };

            // --
            // Init
            // --

            scope.init();
        },
        controller: function($scope) {

            // ~~

        }
    }
});
