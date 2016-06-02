angular.module('TinyNewsApp.Services')
    .service('ActiveUser', function($rootScope) {

        // --
        // Properties
        // --

        var token = NL_USER_DATA; // From the Document
        var index = {};
        var socket = false;

        // --
        // Init
        // --

        if (token && typeof io == 'function') {
            console.log('Connecting to TinyNews.com Socket Server');
            socket = io(NL_WS_HOST, {
                query: 'auth_token=' + token.token
            });

            // --
            // Debug Events
            // --

            socket.on('connect', function() {
                $rootScope.$broadcast('socket_available', true);
                console.log('Socket connected.');
            });

            socket.on('connect_error', function() {
                console.log('Error connecting to socket...');
            });

            socket.on('connect_timeout', function() {
                console.log('Socket connection timed out...');
            });

            socket.on('reconnect_attempt', function() {
                console.log('Attempting socket reconnect...');
            });

            socket.on('reconnecting', function() {
                console.log('Socket reconnecting...');
            });

            socket.on('reconnect_error', function() {
                console.log('Error reconnecting to socket...');
            });

            socket.on('reconnect_failed', function() {
                console.log('Failed to reconnect to socket...');
            });

            // --
            // App Events
            // --

            /**
             * Just a message to log to the clients console
             */
            socket.on('log', function(event) {
                console.log('Socket Log:', event);
            });

            /**
             * Some subscribed channel has published an event
             */
            socket.on('subscription_event', function(event) {
                console.log('subscription_event', event);
                if (event && event.channel && event.event) {
                    $rootScope.$broadcast(event.channel, event.event);
                }
            });

            /**
             * Subscription request returned as ready
             */
            socket.on('subscription_ready', function(event) {
                console.log('subscription_ready', event);
                if (event && event.channel) {
                    $rootScope.$broadcast('subscription_ready', event.channel);
                }
            });

        } else {
            console.log('Not using Socket...');
        }

        return {

            // --
            // Public Service Methods
            // --

            /**
             * Return the requested object.
             *
             * @param   string      index   The objects @rid
             * @returns obj
             */
            Get: function(index) {
                return token[index] || false;
            },

            /**
             * Check if the user is registered (not annonymous).
             *
             * @param   string      index   The objects @rid
             * @returns obj
             */
            IsRegistered: function() {
                if (token.user['@rid']) {
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * Check if the user is following an object.
             *
             * @param   string      type    Type of data object
             * @param   string      id      @rid of the object
             * @returns bool
             */
            IsFollowing: function(type, id) {
                if (!index[type]) {
                    index[type] = {};
                    for (var i in token.user.settings[type]) {
                        index[type][ token.user.settings[type][i]['@rid'] ] = true;
                    }
                }

                try {
                    return index[type][id];
                }
                catch(e) {
                    return false;
                }
            },

            /**
             * Subscribe to an event channel
             *
             * @param   string      channel     Name of channel to subscribe to
             */
            Subscribe: function(channel) {
                socket.emit('subscribe', { channel: channel });
            }

        }
    })