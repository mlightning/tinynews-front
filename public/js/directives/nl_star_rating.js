angular.module('TinyNewsApp.Directives').directive('nlStarRating', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            rating: '=rating',
            color: '&color'
        },
        template:
            '<span class="rating-stars" data-toggle="tooltip" data-placement="top">' +
            '    <span ng-repeat="star in stars track by $index" class="fa fa-{{star}} {{draw_color}}"></span>' +
            '</span>',
        link: function (scope, element, attrs) {
            scope.stars = ['star-o','star-o','star-o','star-o','star-o'];
            scope.draw_color = false;

            // --
            // Events
            // --

            scope.$watch('rating', function() {
                scope.refresh();
            });

            // --
            // Methods
            // --

            scope.refresh = function() {
                scope.rating = parseFloat(scope.rating);
                if (isNaN(scope.rating)) {
                    scope.rating = 0;
                }

                for (var i in scope.stars) {
                    if (scope.rating >= (parseInt(i) + 1)) {
                        scope.stars[i] = 'star';
                    } else if (scope.rating > (i) && scope.rating < (parseInt(i) + 1)) {
                        scope.stars[i] = 'star-half-full';
                    } else {
                        scope.stars[i] = 'star-o';
                    }
                }

                if (scope.color) {
                    if (scope.rating <= 2) {
                        scope.draw_color = 'low-rating';
                    } else if (scope.rating > 2 && scope.rating <= 3) {
                        scope.draw_color = 'medium-rating';
                    } else {
                        scope.draw_color = 'high-rating';
                    }
                }

                $(element.find('.rating-stars')).tooltip({ title: "Rating " + scope.rating });
            }

            // --
            // Init
            // --

            scope.refresh();
        },
        controller: function($scope) {

            // ~~

        }
    }
});
