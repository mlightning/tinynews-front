angular.module('TinyNewsApp.Controllers').controller('FeedManagerController', function FeedManagerController($scope, $rootScope, Alerts, Flash, FeedSubscriptions, Loading) {

    $scope.subscriptions = [];
    $scope.subs_index = {};

    $scope.editing = {};
    $scope.wip = { publisher: {} };
    $scope.mode = 'saving'; // Optionally 'editing'.
    $scope.new_subscription = { url: '', publisher: false };

    $scope.selected = 0;

    // --
    // Functions
    // --

    /**
     * Toggles a single subscription as selected or unselected.
     *
     * @param   obj     sub     Clicked subscription object
     */
    $scope.select = function(sub) {
        if (sub.selected) {
            sub.selected = false;
            $scope.selected--;
        } else {
            sub.selected = true;
            $scope.selected++;
        }
    }

    /**
     * Complete toggle of all subscriptions
     *
     * @param   bool    mode    true to toggle all on, false to toggle all off
     */
    $scope.toggle_select = function(mode) {
        $scope.subscriptions.forEach(function(item) {
            item.selected = mode;
        });

        if (mode) {
            $scope.selected = $scope.subscriptions.length;
        } else {
            $scope.selected = 0;
        }
    }

    /**
     * Shows the New Subscription Modal
     */
    $scope.show_new_modal = function() {
        $scope.mode = 'saving';
        $scope.editing = angular.copy($scope.new_subscription);
        $('#modal_add_subscription').modal();
    }

    /**
     * Save a new Subscription
     *
     * @param   Obj     sub     New Subscription object
     */
    $scope.add_subscription = function(sub) {
        $('#modal_add_subscription').modal('hide');
        $('#nl_publisher_picker').modal('show');
    }

    /**
     * Edit a Subscription
     */
    $scope.edit_subscription = function() {
        var sub = false;

        $scope.mode = 'editing';

        $scope.subscriptions.forEach(function(item) {
            if (item.selected) {
                sub = item;
            }
        });

        $scope.editing = angular.copy(sub);

        $('#modal_add_subscription').modal('show');
    }

    /**
     * Edit a Subscription's Publisher
     *
     * @param   Obj     sub     New Subscription object
     */
    $scope.edit_sub_publisher = function(sub) {
        $('#modal_add_subscription').modal('hide');
        $('#nl_publisher_picker').modal('show');
    }

    /**
     * Push changes to server.
     *
     * @param   Obj     publisher     Incoming selected Publisher
     */
    $scope.save_subscription = function(publisher) {
        Loading.Show();

        $scope.editing.publisher_id = publisher['@rid'];

        async.series({
            delete_if_needed: function(done) {
                // Remove existing entry if required.
                if ($scope.editing['@rid']) {
                    FeedSubscriptions.Delete($scope.editing).then(
                        function() {
                            $scope.selected--;
                            done();
                        },
                        function(data) {
                            done(data);
                        }
                    );
                } else {
                    done();
                }
            },
            save_entry: function(done) {
                FeedSubscriptions.Save($scope.editing).then(
                    function(subs) {
                        $scope.editing = angular.copy($scope.new_subscription);

                        $scope.subs_index = {};
                        $scope.subscriptions = [];
                        for (var i in subs) {
                            $scope.subs_index[subs[i]['@rid']] = subs[i];
                            $scope.subscriptions.push($scope.subs_index[subs[i]['@rid']]);
                        }

                        done();
                    },
                    function(data) {
                        done(data);
                    }
                );
            }
        }, function(errors) {
            if (errors) {
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem saving that subscription.');
                Loading.Hide();
                console.log(data);
            } else {
                Loading.Hide();
                Alerts.Signal(Alerts.Type.SUCCESS, 'Subscription saved.');
            }
        });
    };

    /**
     * Delete Subscription
     */
    $scope.delete_subscriptions = function() {
        Loading.Show();
        var count = 0;
        var errors = 0;

        var q = async.queue(function(sub, callback) {
            FeedSubscriptions.Delete(sub).then(
                function(id) {
                    $scope.subscriptions.forEach(function(sub, i) {
                        if (sub['@rid'] == id) {
                            $scope.subscriptions.splice(i, 1);
                            delete $scope.subs_index[id];
                        }
                    });

                    callback();
                },
                function(data) {
                    errors++;
                    console.log('error:' + sub.title, data);
                    callback(data);
                }
            );
        }, 2);

        $scope.subscriptions.forEach(function(sub) {
            if (sub.selected) {
                count++;
                q.push(sub, function(err) {
                    console.log(sub.title, err);
                });
            }
        });

        q.drain = function(err) {
            console.log('Errors During Delete: (' + errors + ')', err);
            if (count > 1) {
                var message = 'Subscriptions deleted.';
            } else {
                var message = 'Subscription deleted.';
            }

            Loading.Hide();
            Alerts.Signal(Alerts.Type.SUCCESS, message);
        }
    };

    /**
     * ~~
     */
    $scope.created_publisher = function(publisher) {
        console.log('$scope.created_publisher');
        $scope.edit_sub_publisher();
    }

    // --
    // Init
    // --

    Loading.Show();

    FeedSubscriptions.List().then(
        function(subs) {
            $scope.subs_index = {};
            $scope.subscriptions = [];
            for (var i in subs) {
                $scope.subs_index[subs[i]['@rid']] = subs[i];
                $scope.subscriptions.push($scope.subs_index[subs[i]['@rid']]);
            }

            Loading.Hide();
        },
        function(data) {
            Loading.Hide();
            Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the subscription list.');
            console.log(data);
        }
    );

});