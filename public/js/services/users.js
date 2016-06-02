angular.module('TinyNewsApp.Services')
    .service('Users', function ($rootScope, $q, User) {

        // --
        // Properties
        // --

        var registry = [];

        // --
        // Private Service Methods
        // --

        // ~~

        // --
        // Init
        // --

        return {

            // --
            // Static Properties
            // --

            // ~~

            // --
            // Public Service Methods
            // --

            /**
             * Modify a User's Personal Info
             *
             * @returns Promise
             */
            UpdateInfo: function(id, props) {
                var deferred = $q.defer();

                User.update(id, props)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            /**
             * Update a User's Profile data
             *
             * @param   string      id      User id
             * @param   obj         props   k/v pairs of properties to change
             * @returns Promise
             */
            UpdateProfile: function(id, props) {
                var deferred = $q.defer();

                User.update_profile(id, props)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            /**
             * Retrieve a User's friend list
             *
             * @returns Promise
             */
            GetFriends: function(id) {
                var deferred = $q.defer();

                User.list_friends(id)
                    .success(function(data) {
                        var results = [];
                        for (var i in data) {
                            registry[data[i]['@rid']] = new User(data[i]);
                            results.push( registry[data[i]['@rid']] );
                        }
                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Start Following a Item
             *
             * @returns Promise
             */
            FollowItem: function(user_id, key, obj) {
                var deferred = $q.defer();
                console.log(obj);
                User.create_feed_setting(user_id, key, obj)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            /**
             * Stop Following a Item
             *
             * @returns Promise
             */
            UnfollowItem: function(user_id, key, item) {
                var deferred = $q.defer();

                User.delete_feed_setting(user_id, key, item)
                    .success(function() {
                        deferred.resolve();
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Change user status to Locked
             *
             * @returns Promise
             */
            LockUser: function(user_id) {

                var deferred = $q.defer();

                User.update(user_id, {status: 2})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            /**
             * Change user status to Active
             *
             * @returns Promise
             */
            UnlockUser: function(user_id) {

                var deferred = $q.defer();

                User.update(user_id, {status: 1})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            /**
             * Resend a User's confirmation email
             *
             * @param   string      id      User id
             * @returns Promise
             */
            ResendConfirmation: function(user_id) {
                var deferred = $q.defer();

                User.resend_confirmation(user_id)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Load list of Users
             *
             * @returns Promise
             */
            List: function() {
                var deferred = $q.defer();

                User.list()
                    .success(function(data, status, headers, config) {
                        var results = [];

                        if (status == 200) {
                            data.forEach(function (user) {
                                registry[user['@rid']] = new User(user);
                                results.push(registry[user['@rid']]);
                            });
                        }

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Load list of validating Users
             *
             * @returns Promise
             */
            ListValidating: function() {
                var deferred = $q.defer();

                User.list_validating()
                    .success(function(data, status, headers, config) {
                        var results = [];

                        if (status == 200) {
                            data.forEach(function (user) {
                                registry[user['@rid']] = new User(user);
                                results.push(registry[user['@rid']]);
                            });
                        }

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Load list of Active Users
             *
             * @returns Promise
             */
            ListActive: function() {
                var deferred = $q.defer();

                User.list_active()
                    .success(function(data, status, headers, config) {
                        var results = [];

                        if (status == 200) {
                            data.forEach(function (user) {
                                registry[user['@rid']] = new User(user);
                                results.push(registry[user['@rid']]);
                            });
                        }

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Load list of Locked Users
             *
             * @returns Promise
             */
            ListLocked: function() {
                var deferred = $q.defer();

                User.list_locked()
                    .success(function(data, status, headers, config) {
                        var results = [];

                        if (status == 200) {
                            data.forEach(function (user) {
                                registry[user['@rid']] = new User(user);
                                results.push(registry[user['@rid']]);
                            });
                        }

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Resend a User's confirmation email
             *
             * @param   string      id      User id
             * @returns Promise
             */
            ResendConfirmation: function(user_id) {
                var deferred = $q.defer();

                User.resend_confirmation(user_id)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            }

        }
    });