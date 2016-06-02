angular.module('TinyNewsApp.Services')
    .service('Tags', function ($rootScope, $q, Tag) {

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

                Tag.search(terms, page, perpage)
                    .success(function(data) {
                        var results = [];

                        data.results.forEach(function(tag) {
                            registry[tag._source['@rid']] = new Tag({
                                name: tag._source.name,
                                slug: tag._source.slug,
                                '@rid': tag._source['@rid']
                            });
                            results.push( registry[tag._source['@rid']] );
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