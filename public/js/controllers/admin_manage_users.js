angular.module('TinyNewsApp.Controllers').controller('UserManagerController',
    function UserManagerController($scope, $rootScope, Users, $timeout, Loading, Alerts, ActiveUser)
{

    // --
    // Properties
    // --

    $scope.users = [];
    $scope.current_view_type = 'list_view';
    $scope.current_page = 0; 
    $scope.page_size = 50;

    $scope.query_input = '';
    $scope.filter = {
        query: ''
    };

    $scope.tabs = {
        all: { active: false },
        active: { active: false },
        validating: { active: false },
        locked: { active: false }
    };

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
        $scope.filter_users();
    }

    /**
     * Filter users by selected filter
     */
    $scope.filter_users = function() {
        switch (true) {
            case $scope.tabs.all.active:
                $scope.get_all_users();
                break;

            case $scope.tabs.active.active:
                $scope.get_active_users();
                break;

            case $scope.tabs.validating.active:
                $scope.get_validating_users();
                break;

            case $scope.tabs.locked.active:
                $scope.get_locked_users();
                break;
        }
    }

    /**
     * Get all users
     */
    $scope.get_all_users = function() {
        Loading.Show();

        Users.List().then(
            function(items) {
                Loading.Hide();
                $scope.users = items;
                $scope.refresh();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading all the users list.');
            }
        );
    }

    /**
     * Get all active users
     */
    $scope.get_active_users = function() {
        Loading.Show();

        Users.ListActive().then(
            function(items) {
                Loading.Hide();
                $scope.users = items;
                $scope.refresh();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading active users list.');
            }
        );
    }

    /**
     * Get all validating users
     */
    $scope.get_validating_users = function() {
        Loading.Show();

        Users.ListValidating().then(
            function(items) {
                Loading.Hide();
                $scope.users = items;
                $scope.refresh();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading validating users list.');
            }
        );
    }

    /**
     * Get all locked users
     */
    $scope.get_locked_users = function() {
        Loading.Show();

        Users.ListLocked().then(
            function(items) {
                Loading.Hide();
                $scope.users = items;
                $scope.refresh();
            },
            function(data, status, headers, config) {
                Loading.Hide();
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading locked users list.');
            }
        );
    }

    // Pagination Functions
    
    $scope.set_page = function(current_page) {
        $scope.current_page = current_page;
    }
    
    $scope.prev_page = function(current_page) {
        if ($scope.current_page) {
            $scope.current_page -= 1;
        }
    }
    
    $scope.next_page = function(current_page) {
        if ($scope.current_page < $scope.no_of_pages()) {
            $scope.current_page += 1;
        }
    }

    $scope.no_of_pages = function() {
        return Math.ceil($scope.users.length/ $scope.page_size);
    };
    
    $scope.refresh = function () {
        $scope.pages = new Array($scope.no_of_pages());
        $scope.set_page(0);
    }
    
    // View Toggling functions
    
    $scope.set_grid_view = function() {
        $scope.current_view_type = 'grid_view';
    };
    
    $scope.set_list_view = function() {
        $scope.current_view_type = 'list_view';
    };

    // Operations

    /**
     * Impersonate the selected user
     *
     * @param   int     user_id     User ID
     */
    $scope.login_as = function(user_id) {
        if (ActiveUser.Get('user').handle == user_id) {
            Alerts.Signal(Alerts.Type.ERROR, 'You have already logged in as this user.');
            return;
        }

        if (confirm('Login as this user (' + user_id + ') ?')) {
            document.location = '/login_as/' + user_id;
        }
    }

    /**
     * Lock the chosen users account
     *
     * @param   int     user_id     User ID
     */
    $scope.lock_user = function(user_id) {
        Users.LockUser(user_id).then(
            function(response) {
                Alerts.Signal(Alerts.Type.SUCCESS, 'User Locked.');
                $scope.filter_users();
                console.log(response);
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating user status.');
            }
        );

    }

    /**
     * Unlock the chosen users account
     *
     * @param   int     user_id     User ID
     */
    $scope.unlock_user = function(user_id) {
        Users.UnlockUser(user_id).then(
            function(response) {
                Alerts.Signal(Alerts.Type.SUCCESS, 'User Unlocked.');
                $scope.filter_users();
                console.log(response);
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem updating user status.');
            }
        );
    }

    /**
     * Resends the confirmation email to users
     *
     * @param   int     user_id     User ID
     */
    $scope.resend_confirmation = function(user_id) {
        Users.ResendConfirmation(user_id).then(
            function(response) {
                Alerts.Signal(Alerts.Type.SUCCESS, 'Resent confirmation email successfully.');
                $scope.filter_users();
                console.log(response);
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                Alerts.Signal(Alerts.Type.ERROR, 'There was a problem resending confirmation email.');
            }
        );
    }

    // --
    // Init
    // --

    $scope.$watch('query_input', function(newValue, oldValue) {
        if (newValue === oldValue) { return; }
        applyQuery();
    });

    $scope.refresh();
    $scope.change_tab('all');

    var applyQuery = function() {
        $scope.filter.query = $scope.query_input;
        $scope.set_page(0);

        $timeout($scope.refresh, 10);
    };

});