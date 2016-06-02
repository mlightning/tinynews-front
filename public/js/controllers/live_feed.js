angular.module('TinyNewsApp.Controllers').controller('LiveFeedController', function LiveFeedController($scope, $rootScope, $location, Alerts, ActiveUser, Articles, Loading) {

    $scope.share_domain = NL_WEB_HOST;

    $scope.articles = [];
    $scope.featured = [];

    $scope.settings = {
        keep_open: 3        // How many entries to start in open mode
    };

    // --
    // Functions
    // --

    // ~~

    // --
    // Init
    // --

    Loading.Show();

    // Avoid any ugly looking urls
    if (window.location.href.indexOf('/#/') < 0) {
        if (ActiveUser.IsRegistered()) {
            window.location.href = window.location.origin + '/#/feed';
        } else {
            window.location.href = window.location.origin + '/#/featured';
        }
    }

    // If an anonymous user tries to view custom feed, show
    // them featured instead.
    if (window.location.href.indexOf('/#/feed') >= 0 && !ActiveUser.IsRegistered()) {
        window.location.href = window.location.origin + '/#/featured';
    }

    Articles.FetchUserFeed().then(
        function(articles) {
            Loading.Hide();
            for (var i in articles) {
                articles[i]._source.is_open = (i < $scope.settings.keep_open) ? true : false;
                articles[i]._source.post_date = new Date(articles[i]._source.post_date);


                // Temporary
                articles[i]._source.rating = 3.5;

                $scope.articles.push( articles[i]._source );
            }
            console.log($scope.articles);
        },
        function(data) {
            Loading.Hide();
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the feed data.');
            console.log(data);
        }
    );

    $scope.$on('socket_available', function() {
        ActiveUser.Subscribe('new_articles');
    });

    $scope.$on('new_articles', function(a, b) {
        $scope.articles.push( b );
        $scope.$apply();
    });

    $rootScope.$on('$locationChangeSuccess', function(event) {
        if ($scope.path != $location.path()) {
            $scope.path = $location.path();
        }
    });

});