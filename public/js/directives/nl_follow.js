angular.module('TinyNewsApp.Directives').directive('nlFollow', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { target: '=target', type: '@type' },
        template: '<button ng-if="!hide" class="btn" style="padding: 15px; width: 100%; margin-bottom: 30px;" ng-class="{ \'btn-success\': !following, \'btn-primary\': following }" ng-click="toggle_following()">{{ (following) ? "FOLLOWING" : "FOLLOW" }}</button>',
        link: function (scope, element, attrs, ctrl) {

        },
        controller: function($scope, Journalists, Users, ActiveUser, Alerts) {

            // --
            // Methods
            // --

            $scope.toggle_following = function() {
                if ($scope.following) {
                    // Unfollow
                    Users.UnfollowItem(ActiveUser.Get('user')['@rid'], $scope.type, $scope.target).then(
                        function() {
                            $scope.following = !$scope.following;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem unfollowing ' + $scope.type.slice(0, -1) + '.');
                        }
                    );
                } else {
                    // Follow
                    Users.FollowItem(ActiveUser.Get('user')['@rid'], $scope.type, $scope.target).then(
                        function () {
                            $scope.following = !$scope.following;
                        },
                        function (data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem following ' + $scope.type.slice(0, -1) + '.');
                        }
                    );
                }
            }

            // --
            // Init
            // --

            if (ActiveUser.IsRegistered()) {
                $scope.following = ActiveUser.IsFollowing($scope.type, $scope.target['@rid']);
            } else {
                $scope.hide = true;
            }

        }
    }
});
