angular.module('TinyNewsApp.Controllers')
    .controller('PasswordRecoveryController', ['$scope', '$rootScope',
        function PasswordRecoveryController($scope, $rootScope) {

            $scope.data = {
                email: ''
            };
            $scope.back = function(){
                window.history.back();
            };


            $scope.submit = function() {
                // ~~
            };

        }]);