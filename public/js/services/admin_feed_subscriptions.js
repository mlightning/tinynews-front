angular.module('TinyNewsApp.Services')
    .service('FeedSubscriptions', function ($rootScope, $http, $q, RID) {

        // --
        // Properties
        // --

        var registry = {};

        // --
        // Private Service Methods
        // --

        // ~~

        // --
        // Init
        // --

        return {

            // ~~

            // --
            // Public Service Methods
            // --

            /**
             * Get the full list of Subscriptions.
             *
             * @returns Promise
             */
            List: function() {
                var deferred = $q.defer();

                $http.get(NL_API_HOST + '/feeds')
                    .success(function(subs) {
                        if (subs && subs instanceof Array) {
                            subs.forEach(function(sub) {
                                registry[sub['@rid']] = sub;
                            });
                        } else {
                            registry = {};
                        }

                        deferred.resolve(registry);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });

                return deferred.promise;
            },

            /**
             * Save a Subscription
             *
             * @params  Obj     sub     Subscription to save
             * @returns Promise
             */
            Save: function(sub) {
                var deferred = $q.defer();

                $http.post(NL_API_HOST + '/feed', sub)
                    .success(function(res) {
                        registry[res['@rid']] = res;
                        deferred.resolve(registry);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });

                return deferred.promise;
            },

            /**
             * Remove a Subscription
             *
             * @params  Obj     sub     Subscription to delete
             * @returns Promise
             */
            Delete: function(sub) {
                var deferred = $q.defer();

                $http.delete(NL_API_HOST + '/feed/' + RID.Encode(sub['@rid']))
                    .success(function(res) {
                        for (var i in registry) {
                            if (i == sub['@rid']) {
                                delete registry[i];
                                break;
                            }
                        }

                        deferred.resolve(sub['@rid']);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        deferred.reject(data);
                    });

                return deferred.promise;
            }

        }
    });