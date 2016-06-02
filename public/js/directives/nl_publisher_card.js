angular.module('TinyNewsApp.Directives').directive('nlPublisherCard', function ($rootScope, $compile, $templateCache) {
    return {
        restrict: 'EA',
        scope: {
            publisher: '=publisher',
            template: '@template'
        },
        link: function (scope, element, attrs) {
            if (attrs.template) {
                element.html($templateCache.get(attrs.template)).show();
            } else {
                element.html($templateCache.get('nl_publisher_card.html')).show();
            }

            $compile( element.contents() )(scope);
        },
        controller: function($scope, Publishers, Users, ActiveUser, Alerts) {

            // --
            // Methods
            // --

            $scope.toggle_following = function() {
                if ($scope.following) {
                    // Unfollow
                    Users.UnfollowPublisher(ActiveUser.Get('user')['@rid'], $scope.publisher).then(
                        function() {
                            $scope.following = !$scope.following;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem unfollowing publisher.');
                        }
                    );
                } else {
                    // Follow
                    Users.FollowPublisher(ActiveUser.Get('user')['@rid'], $scope.publisher).then(
                        function() {
                            $scope.following = !$scope.following;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem following publisher.');
                        }
                    );
                }
            }

            // --
            // Init
            // --

            if (ActiveUser.IsRegistered()) {
                $scope.following = ActiveUser.IsFollowing('publishers', $scope.publisher['@rid']);
                $scope.registered = true;
            } else {
                $scope.registered = false;
            }

        }
    }
});
