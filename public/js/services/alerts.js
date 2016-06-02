angular.module('TinyNewsApp.Services')
    .service('Alerts', function ($rootScope) {

        // --
        // Properties
        // --

        var alerts = [];

        // --
        // Private Service Methods
        // --

        // ~~

        // --
        // Init
        // --

        return {

            Type: {
                INFO: { name: 'info', icon: 'info', style: 'info' },
                SUCCESS: { name: 'success', icon: 'check', style: 'success' },
                WARN: { name: 'warn', icon: 'warning', style: 'warning' },
                ERROR: { name: 'error', icon: 'times-circle', style: 'danger' }
            },

            Status: {
                ACTIVE: 0,
                LOGGED: 1
            },

            // --
            // Public Service Methods
            // --

            Signal: function(type, message, position, icon) {
                if (!icon) {
                    icon = type.icon;
                }

                if (!position) {
                    position = 'center';
                }

                var alert = {
                    message: message,
                    type: type.name,
                    icon: icon,
                    style: type.style,
                    timestamp: new Date(),
                    position: position,
                    status: 0
                };

                alerts.push(alert);

                setTimeout(function() {
                    alert.status = 1;
                    $rootScope.$apply();
                }, 6000)
            },

            Fetch: function() {
                return alerts;
            },

            GetType: function(name) {
                var result = false;
                for (var i in this.Type) {
                    if (this.Type[i].name == name) {
                        result = this.Type[i];
                    }
                }
                return result;
            }

        }
    });