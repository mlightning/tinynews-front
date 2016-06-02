angular.module('TinyNewsApp.Controllers')
    .controller('LoginController', ['$scope', '$rootScope',
        function LoginController($scope, $rootScope) {

            $scope.data = {
                password: '',
                handle: ''
            };
            $scope.back = function(){
                window.history.back();
            };

            $scope.submit = function() {
                // ~~
            };

        }]);