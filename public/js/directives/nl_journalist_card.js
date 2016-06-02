angular.module('TinyNewsApp.Directives').directive('nlJournalistCard', function ($rootScope, $compile, $templateCache) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            journalist: '=journalist',
            template: '@template'
        },
        link: function (scope, element, attrs) {
            if (attrs.template) {
                element.html($templateCache.get(attrs.template)).show();
            } else {
                element.html($templateCache.get('nl_journalist_card.html')).show();
            }

            $compile( element.contents() )(scope);
        },
        controller: function($scope, Journalists, Users, ActiveUser, Alerts) {

            // --
            // Methods
            // --

            $scope.toggle_following = function() {
                if ($scope.following) {
                    // Unfollow
                    Users.UnfollowJournalist(ActiveUser.Get('user')['@rid'], $scope.journalist).then(
                        function() {
                            $scope.following = !$scope.following;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem unfollowing journalist.');
                        }
                    );
                } else {
                    // Follow
                    Users.FollowJournalist(ActiveUser.Get('user')['@rid'], $scope.journalist).then(
                        function() {
                            $scope.following = !$scope.following;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem following journalist.');
                        }
                    );
                }
            }

            // --
            // Init
            // --

            if (ActiveUser.IsRegistered()) {
                $scope.following = ActiveUser.IsFollowing('journalists', $scope.journalist['@rid']);
                $scope.registered = true;
            } else {
                $scope.registered = false;
            }

        }
    }
});
