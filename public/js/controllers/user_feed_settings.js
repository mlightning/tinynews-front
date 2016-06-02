angular.module('TinyNewsApp.Controllers')
.controller('UserFeedSettingsController', function UserFeedSettingsController(
    $scope, $rootScope, Users, User, Alerts, Tags, Journalists, Publishers, Groups, Loading, Preload
) {

    $scope.tabs = {
        ratings: { active: false },
        tags: { active: false },
        journalists: { active: false },
        publishers: { active: false },
        friends: { active: false },
        groups: { active: false }
    };

    $scope.tags = [];
    $scope.journalists = [];
    $scope.publishers = [];

    $scope.settings = {};
    $scope.rating_options = [1,2,3,4,5];

    // --
    // Functions
    // --

    /**
     * Change Tab
     */
    $scope.change_tab = function(tab) {
        for (var i in $scope.tabs) {
            $scope.tabs[i].active = false;
        }

        $scope.tabs[tab].active = true;
    }

    /**
     * Toggle the 'use public ratings' option
     */
    $scope.set_rating = function(num) {
        User.update_feed_setting($scope.user_id, 'avg_article_rating', { avg_article_rating: $scope.settings.avg_article_rating })
            .success(function() {
                Alerts.Signal(Alerts.Type.SUCCESS, 'Settings updated.');
            })
            .error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                $scope.settings.avg_article_rating = $scope.original.avg_article_rating;
                Alerts.Signal(Alerts.Type.ERROR, 'Problem updating settings.');
            });
    }

    /**
     * Toggle the 'use public ratings' option
     */
    $scope.toggle_public_ratings = function() {
        var new_val = !$scope.settings.track_public_ratings;
        new_val = (new_val) ? 1 : 0;

        User.update_feed_setting($scope.user_id, 'track_public_ratings', { track_public_ratings: new_val })
            .success(function() {
                $scope.settings.track_public_ratings = new_val;
                Alerts.Signal(Alerts.Type.SUCCESS, 'Settings updated.');
            })
            .error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'Problem updating settings.');
            });
    }

    /**
     * Remove an item from your settings.
     *
     * @param   String  type  Setting type
     * @param   Obj     obj   Item to remove
     */
    $scope.del_item = function(type, obj) {
        $scope.settings[type].forEach(function(item, i) {
            if (item['@rid'] == obj['@rid']) {
                User.delete_feed_setting($scope.user_id, type, item)
                    .success(function() {
                        $scope.settings[type].splice(i, 1);
                        $scope.sync(type);
                        Alerts.Signal(Alerts.Type.SUCCESS, 'Settings updated.');
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        Alerts.Signal(Alerts.Type.ERROR, 'Problem updating settings.');
                    });
            }
        });
    }

    /**
     * Add an item to your settings.
     *
     * @param   String  type  Setting type
     * @param   Obj     obj   Item to remove
     */
    $scope.add_item = function(type, obj) {
        User.create_feed_setting($scope.user_id, type, obj)
            .success(function(data) {
                $scope.settings[type].push(obj);
                $scope.sync(type);
                Alerts.Signal(Alerts.Type.SUCCESS, 'Settings updated.');
            })
            .error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'Problem updating settings.');
            });
    }

    $scope.sync = function(type) {
        var index = {};
        $scope[type] = [];

        $scope.settings[type].forEach(function(item, i) {
            index[item['@rid']] = item;
        });

        $scope['all_' + type].forEach(function(item, i) {
            if (!index[item['@rid']]) {
                $scope[type].push( item );
            }
        });
    }

    $scope.revert = function() {
        $scope.settings = angular.copy($scope.original);
    }

    $scope.search_tags = function() {
        Tags.Search($scope.tag_search).then(
            function(items) {
                $scope.all_tags = items;
                $scope.sync('tags');
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem searching the tags list.');
            }
        );
    }

    $scope.search_publishers = function() {
        Publishers.Search($scope.pub_search).then(
            function(items) {
                $scope.all_publishers = items;
                $scope.sync('publishers');
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem searching the publishers list.');
            }
        );
    }

    $scope.search_journalists = function() {
        Journalists.Search($scope.journalist_search).then(
            function(items) {
                $scope.all_journalists = items;
                $scope.sync('journalists');
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem searching the journalists list.');
            }
        );
    }

    // --
    // Init
    // --

    $scope.settings = Preload.Get('settings');
    $scope.user_id = Preload.Get('user')['@rid'];

    $scope.original = angular.copy($scope.settings);

    $scope.change_tab('ratings');

    Tags.Search().then(
        function(items) {
            $scope.all_tags = items;
            $scope.sync('tags');
        },
        function(data, status, headers, config) {
            console.log(data, status, headers, config);
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the tags list.');
        }
    );

    Journalists.Search().then(
        function(items) {
            $scope.all_journalists = items;
            $scope.sync('journalists');
        },
        function(data, status, headers, config) {
            console.log(data, status, headers, config);
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the journalists list.');
        }
    );

    Publishers.Search().then(
        function(items) {
            $scope.all_publishers = items;
            $scope.sync('publishers');
        },
        function(data, status, headers, config) {
            console.log(data, status, headers, config);
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the publishers list.');
        }
    );

    Groups.Search().then(
        function(items) {
            $scope.all_groups = items;
            $scope.sync('groups');
        },
        function(data, status, headers, config) {
            console.log(data, status, headers, config);
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the groups list.');
        }
    );

    Users.GetFriends($scope.user_id).then(
        function(items) {
            $scope.all_friends = items;
            $scope.sync('friends');
        },
        function(data, status, headers, config) {
            console.log(data, status, headers, config);
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the friends list.');
        }
    );

});