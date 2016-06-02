angular.module('TinyNewsApp.Services')
    .service('Comments', function ($rootScope, $q, Comment, RID) {

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

            Type: {
                ARTICLE: 0,
                PUBLISHER: 1,
                JOURNALIST: 2
            },

            Types: {
                'article': 0,
                'publisher': 1,
                'journalist': 2
            },

            // --
            // Public Service Methods
            // --

            /**
             * List the Comments for an Object
             *
             * @param string    id      Object ID
             * @param string    type    Comment Type
             */
            List: function(id, type) {
                var deferred = $q.defer();

                Comment.list(id, type)
                    .success(function(data) {
                        registry[id] = {};

                        // Sort Comments by Parent
                        for (var i in data) {
                            var comment = data[i];

                            comment.unique = RID.Encode(comment['@rid']).replace('.', '_');

                            if (!comment.parent_id) {
                                if (!registry[id]['top']) {
                                    registry[id]['top'] = [];
                                }
                                registry[id]['top'].push(comment);
                            } else {
                                if (!registry[id][comment.parent_id]) {
                                    registry[id][comment.parent_id] = [];
                                }
                                registry[id][comment.parent_id].push(comment);
                            }
                        }

                        console.log('Comments !!!!!!', registry[id]);

                        deferred.resolve(registry[id]);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Create a Comment
             *
             * @param string    props   Object Properties
             * @param string    type    Comment Type
             */
            Create: function(props, type) {
                var deferred = $q.defer();

                Comment.create(type, props)
                    .success(function(data) {

                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },

            /**
             * Vote on a Comment
             *
             * @param string    id      Object ID
             * @param string    vote    Vote value [1/-1]
             */
            Vote: function(id, vote) {
                var deferred = $q.defer();

                Comment.vote(id, vote)
                    .success(function(data) {
                        // ~~

                        deferred.resolve({});
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },
        }
    });