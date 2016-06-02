angular.module('TinyNewsApp.Controllers').controller(
    'ViewArticleController', function ViewArticleController($scope, $rootScope, $location, $timeout, Preload, $http, Articles, Alerts)
{
    // --
    // Properties
    // --

    $scope.article      = Preload.Get('article');
    $scope.my_rating    = 0;
    $scope.rate_promise = null;
    $scope.article.user_rating = {};
    $scope.article.user_rating.importance   =  1;
    $scope.article.user_rating.independence =  1;
    $scope.article.user_rating.factuality   =  1;
    $scope.article.user_rating.transparency   =  1;
    $scope.check_user_rating = false;
    $scope.share_url = window.location.href;
    $scope.featured = [];
    // --
    // Functions
    // --

    // Calculate the average rating of the article
    $scope.calc_average_rating = function() {
        var total=0;
        for (key in $scope.article.user_rating) {
            total+=$scope.article.user_rating[key];
        }
        var rating = (total/4);

        $scope.my_rating = rating;

    }

    // API call to get the user's rating for this article
    $scope.get_user_rating = function(){
        Articles.GetUserRating($scope.article).then(
            function(user_rating) {
                $scope.article.user_rating.importance   = user_rating.importance || 1;
                $scope.article.user_rating.independence = user_rating.independence || 1;
                $scope.article.user_rating.factuality   = user_rating.factuality || 1;
                $scope.article.user_rating.transparency   = user_rating.transparency || 1;
                $scope.calc_average_rating();
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
            }
        )
    }

    //Rate the article
    $scope.rate = function() {
        Articles.Rate($scope.article).then(
            function () {
                //
            },
            function() {
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem while saving your rating.');
            }
        )
    }

    //Fetch featured articles
    $scope.get_featured = function() {
        Articles.FetchFeatured().then(
            function(results) {
                console.log(results);
                for (var i in results) {
                    $scope.featured.push( results[i]._source );
                }
            },
            function(data) {
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the featured articles.');
                console.log(data);
            }
        );
    }


    // --
    // Events
    // --

    $scope.$watch('article.user_rating', function(new_val, old_val) {
        if(new_val !== old_val) {
            $scope.calc_average_rating();
            if ($scope.check_user_rating) {
                if ($scope.rate_promise) {
                    $timeout.cancel($scope.rate_promise);
                }

                $scope.rate_promise = $timeout($scope.rate, 2500);
            } else {
                $scope.check_user_rating = true;
            }
        }
    }, true);

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.path = $location.path();
    })

    // --
    // Init
    // --

    // Avoid any ugly looking urls
    if (window.location.href.indexOf('/#/') < 0) {
        var build_url = window.location.origin + '/article/'+$scope.article.slug+'/#/';
        window.location.href = build_url;
    }

    $scope.get_user_rating();
    $scope.calc_average_rating();
    $scope.get_featured();

});