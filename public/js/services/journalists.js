angular.module('TinyNewsApp.Services')
    .service('Journalists', function ($rootScope, $q, Journalist) {

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

                Journalist.search(terms, page, perpage)
                    .success(function(data) {
                        var results = [];

                        data.results.forEach(function(journalist) {
                            registry[journalist._source['@rid']] = new Journalist(journalist._source);
                            results.push( registry[journalist._source['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            List: function() {
                var deferred = $q.defer();

                Journalist.list()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(journal) {
                            registry[journal['@rid']] = new Journalist(journal);
                            results.push( registry[journal['@rid']] );
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

                Journalist.list_mine()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(journal) {
                            registry[journal['@rid']] = new Journalist(journal);
                            results.push( registry[journal['@rid']] );
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

                Journalist.list_toprated()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(journal) {
                            registry[journal['@rid']] = new Journalist(journal);
                            results.push( registry[journal['@rid']] );
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

                Journalist.list_recent()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(journal) {
                            registry[journal['@rid']] = new Journalist(journal);
                            results.push( registry[journal['@rid']] );
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

                Journalist.list_recent_ratedbyfriends()
                    .success(function(data) {
                        var results = [];

                        data.forEach(function(journal) {
                            registry[journal['@rid']] = new Journalist(journal);
                            results.push( registry[journal['@rid']] );
                        });

                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Modify a Journalist's Info
             *
             * @returns Promise
             */
            UpdateInfo: function(id, props) {
                var deferred = $q.defer();

                Journalist.update(id, props)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });


                return deferred.promise;
            },
        }
    });