angular.module('TinyNewsApp.Directives').directive('nlGroupMembership', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { group: '=group' },
        template: '<button class="btn" style="padding: 15px; width: 100%; margin-bottom: 30px;" ng-class="{ \'btn-success\': !is_member, \'btn-primary\': is_member }" ng-click="toggle_membership()">{{ (is_member) ? "LEAVE GROUP" : "JOIN GROUP" }}</button>',
        link: function (scope, element, attrs, ctrl) {
        },
        controller: function($scope, Groups, Users, ActiveUser, Alerts) {
            // --
            // Methods
            // --
            $scope.toggle_membership = function() {
                if ($scope.is_member) {
                    // Unfollow
                    Groups.Leave(ActiveUser.Get('user')['@rid'], $scope.group['@rid']).then(
                        function() {
                            $scope.is_member = !$scope.is_member;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem Leaving Group.');
                        }
                    );
                } else {
                    // Follow
                    Groups.Join(ActiveUser.Get('user')['@rid'], $scope.group['@rid']).then(
                        function() {
                            $scope.is_member = !$scope.is_member;
                        },
                        function(data, status, headers, config) {
                            console.log(data, status, headers, config);
                            Alerts.Signal(Alerts.Type.ERROR, 'Problem Joining Group.');
                        }
                    );
                }
            }

            // --
            // Init
            // --
            if (ActiveUser.IsRegistered()) {
                $scope.is_member = Groups.IsMember(ActiveUser.Get('user')['@rid'],$scope.group);
            } else {
                $scope.hide = true;
            }

        }
    }
});
