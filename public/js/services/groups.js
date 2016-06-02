angular.module('TinyNewsApp.Services')
    .service('Groups', function ($rootScope, $q, Group) {

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

            Search: function(terms) {
                var deferred = $q.defer();

                Group.list()
                    .success(function(data) {
                        var results = [];
                        for (var i in data) {
                            registry[data[i]['@rid']] = new Group(data[i]);
                            results.push( registry[data[i]['@rid']] );
                        }
                        deferred.resolve(results);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },
            Join: function(user,group){
                var deferred = $q.defer();
                Group.join(user,group)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },
            Leave:function(user,group) {
                var deferred = $q.defer();
                Group.leave(user,group)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },
            Create:function(props) {
                var deferred = $q.defer();
                console.log('in Groups service');
                Group.create(props)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data, status, headers, config);
                    });

                return deferred.promise;
            },
           IsMember:function(userId,group) {
                var memberLen;
                memberLen = group.members.length;
                for ( var i = 0; i < memberLen; i++ ) {
                    var ism = group.members[i]['@rid'] === userId;
                    if(ism) {
                        return true;
                    }
                }
                return false;
            }
        }
    });