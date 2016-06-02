var TinyNewsApp = app = angular.module('TinyNewsApp', [
    'TinyNewsApp.Controllers',
    'TinyNewsApp.Directives',
    'TinyNewsApp.Services',
    'TinyNewsApp.Models',
    'TinyNewsApp.Filters',
    'CommonModels',
    'CommonServices',
    'ngSanitize',
    'ngAnimate',
    'ngRoute',
    'duScroll',
    'angularFileUpload'
]);

app.run(function($rootScope, $http, ActiveUser) {

    /**
     * Default AJAX Headers
     */
    if (ActiveUser.Get('token')) {
        $http.defaults.headers.common['X-Auth-Token'] = ActiveUser.Get('token');
    }

    /**
     * Receive broadcast request
     */
    $rootScope.$on('new_broadcast', function(event, args) {
        if (args && args.channel && args.data) {
            $rootScope.$broadcast(args.channel, args.data);
        } else {
            $rootScope.$broadcast('broadcast', args);
        }
    });

});

angular.module('TinyNewsApp.Controllers', []);
angular.module('TinyNewsApp.Directives', []);
angular.module('TinyNewsApp.Services', []);
angular.module('TinyNewsApp.Models', []);
angular.module('TinyNewsApp.Filters', []);
// Required when importing angular models from tinynews-common
angular.module('CommonModels', []);
// Required when importing angular services from tinynews-common
angular.module('CommonServices', []);


