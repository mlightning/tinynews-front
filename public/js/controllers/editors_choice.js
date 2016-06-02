angular.module('TinyNewsApp.Controllers').controller('EditorsChoiceController',
    function EditorsChoiceController($scope, $rootScope, $location, $filter, Preload, Articles, $timeout, Loading, Alerts, ActiveUser)
    {

        // --
        // Properties
        // --

        $scope.articles = [];
        $scope.displayed = [];
        $scope.tab = 'editors-choice';
        $scope.current_page = 0;
        $scope.page_size = 3;

        // --
        // Functions
        // --

        $scope.do_filters = function() {
            $scope.displayed = $filter('startFrom')($scope.articles, $scope.current_page * $scope.page_size);
            $scope.displayed = $filter('limitTo')($scope.displayed, $scope.page_size);
        }

        // Functions to retrieve list of articles

        $scope.get_editors_choice = function() {
            Loading.Show();

        }

        $scope.get_my_feed = function() {
            Loading.Show();
            Articles.FetchUserFeed().then(
                function(articles) {
                    Loading.Hide();
                    for (var i in articles) {

                        // Temporary
                        articles[i]._source.rating = 3.5;

                        $scope.articles.push( articles[i]._source );
                    }
                    $scope.do_filters();
                },
                function(data) {
                    Loading.Hide();
                    Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the feed data.');
                    console.log(data);
                }
            );
        }

        // UI Controls

        $scope.change_tab = function(tab) {
            $scope.tab = tab;

            switch (tab) {
                case 'editors-choice':
                        $scope.articles = [];
                        $scope.do_filters();
                    break;

                case 'most-reviewed':
                    $scope.articles = [];
                    $scope.do_filters();
                    break;

                case 'my-feed':
                    $scope.get_my_feed();
                    break;
            }
        }

        // Pagination Functions

        $scope.set_page = function(current_page) {
            $scope.current_page = current_page;
            $scope.do_filters();
        }

        $scope.no_of_pages = function() {
            return Math.ceil($scope.articles.length / $scope.page_size);
        };

        // --
        // Events
        // --

        $rootScope.$on('$locationChangeSuccess', function(event) {
            if ($scope.path != $location.path()) {
                $scope.path = $location.path();
                $scope.change_tab($scope.path.split('/')[1]);
            }
        });

        // --
        // Init
        // --

        // Avoid any ugly looking urls
        if (window.location.href.indexOf('/#/') < 0) {
            window.location.href = window.location.origin + '/editors-choice/#/editors-choice/';
        }

        // Set initial list
        $scope.do_filters();

    });