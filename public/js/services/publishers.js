angular.module('TinyNewsApp.Services')
    .service('Publishers', function ($rootScope, $q, Publisher) {

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

            Search: function(terms, page, perpage) {
                var deferred = $q.defer();

                Publisher.search(terms, page, perpage)
                    .success(function(data) {
                        var results = [];

                        data.results.forEach(function(pub) {
                            registry[pub._source['@rid']] = new Publisher(pub._source);
                            results.push( registry[pub._source['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            Save: function(props) {
                var deferred = $q.defer();

                Publisher.create(props)
                    .success(function(data) {
                        registry[data['@rid']] = new Publisher(data);
                        deferred.resolve(registry[data['@rid']]);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Update Publisher's Info
             *
             * @returns Promise
             */
            UpdateInfo: function(id, props) {
                var deferred = $q.defer();

                Publisher.update(id, props)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },

            List: function() {
                var deferred = $q.defer();

                Publisher.list()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(pub) {
                            registry[pub['@rid']] = new Publisher(pub);
                            results.push( registry[pub['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },


            ListMine: function() {
                var deferred = $q.defer();

                Publisher.list_mine()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(pub) {
                            registry[pub['@rid']] = new Publisher(pub);
                            results.push( registry[pub['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            ListTopRated: function() {
                var deferred = $q.defer();

                Publisher.list_toprated()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(pub) {
                            registry[pub['@rid']] = new Publisher(pub);
                            results.push( registry[pub['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            ListRecent: function() {
                var deferred = $q.defer();

                Publisher.list_recent()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(pub) {
                            registry[pub['@rid']] = new Publisher(pub);
                            results.push( registry[pub['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            ListRecentRatedByFriends: function() {
                var deferred = $q.defer();

                Publisher.list_recent_ratedbyfriends()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(pub) {
                            registry[pub['@rid']] = new Publisher(pub);
                            results.push( registry[pub['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            }
        }
    });