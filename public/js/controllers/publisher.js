angular.module('TinyNewsApp.Controllers').controller('PublisherController',
    function PublisherController($scope, $rootScope, $location, $filter, Preload, Publishers, $timeout, Loading, Alerts, ActiveUser)
{

    // --
    // Properties
    // --

    $scope.items = Preload.Get('publishers');
    $scope.view_mode = 'grid';
    $scope.query = '';
    $scope.filtered = [];
    $scope.displayed = [];
    $scope.tab = 'all';
    $scope.current_page = 0;
    $scope.page_size = 15;

    // --
    // Functions
    // --

    // Refresh Filtering

    $scope.do_filters = function() {
        $scope.filtered = $filter('filter')($scope.items, $scope.query);
        $scope.displayed = $filter('startFrom')($scope.filtered, $scope.current_page * $scope.page_size);
        $scope.displayed = $filter('limitTo')($scope.displayed, $scope.page_size);
    }

    // Functions to retrieve list of publishers

    $scope.get_all_publishers = function() {
        Loading.Show();

        Publishers.List().then(
            function(items) {
                Loading.Hide();
                $scope.items = items;
                $scope.do_filters();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading all the publishers list.');
            }
        );
    }

    $scope.get_top_publishers = function() {
        Loading.Show();

        Publishers.ListTopRated().then(
            function(items) {
                Loading.Hide();
                $scope.items = items;
                $scope.do_filters();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading top publishers list.');
            }
        );
    }

    $scope.get_my_publishers = function() {
        Loading.Show();

        Publishers.ListMine().then(
            function(items) {
                Loading.Hide();
                $scope.items = items;
                $scope.do_filters();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading my publishers list.');
            }
        );
    }

    $scope.get_recent_publishers = function() {
        Loading.Show();

        Publishers.ListRecent().then(
            function(items) {
                Loading.Hide();
                $scope.items = items;
                $scope.do_filters();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading recent publishers list.');
            }
        );
    }

    $scope.get_recent_friendsrated_publishers = function() {
        Loading.Show();

        Publishers.ListRecentRatedByFriends().then(
            function(items) {
                Loading.Hide();
                $scope.items = items;
                $scope.do_filters();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading recent rated publishers list.');
            }
        );
    }

    // UI Controls

    $scope.set_view = function(view_mode) {
        $scope.view_mode = view_mode;
    }

    $scope.change_tab = function(tab) {
        $scope.tab = tab;

        switch (tab) {
            case 'all':
                $scope.get_all_publishers();
                break;

            case 'top':
                $scope.get_top_publishers();
                break;

            case 'mine':
                $scope.get_my_publishers();
                break;

            case 'recent':
                $scope.get_recent_publishers();
                break;

            case 'friends':
                $scope.get_recent_friendsrated_publishers();
                break;
        }
    }

    // Pagination Functions

    $scope.set_page = function(current_page) {
        $scope.current_page = current_page;
        $scope.do_filters();
    }

    $scope.no_of_pages = function() {
        return Math.ceil($scope.filtered.length / $scope.page_size);
    };

    // --
    // Events
    // --

    $rootScope.$on('$locationChangeSuccess', function(event) {
        if ($scope.path != $location.path()) {
            $scope.path = $location.path();
            $scope.change_tab($scope.path.split('/')[1]);
            $scope.view_mode = $scope.path.split('/')[2] || 'grid';
        }
    });

    $scope.$watch('query', function(newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.set_page(0);
            $scope.do_filters();
        }
    });

    // --
    // Init
    // --

    // Avoid any ugly looking urls
    if (window.location.href.indexOf('/#/') < 0) {
        window.location.href = window.location.origin + '/publishers/#/all/';
    }

    // Set initial list
    $scope.do_filters();

});