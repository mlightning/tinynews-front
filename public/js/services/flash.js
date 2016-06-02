angular.module('TinyNewsApp.Services')
    .service('Flash', function($rootScope) {

        // --
        // Properties
        // --

        var data = NL_FLASH_MSG; // From the Document

        return {

            Type: {
                INFO: 'info',
                WARN: 'warn',
                SUCCESS: 'success',
                ERROR: 'error'
            },

            // --
            // Public Service Methods
            // --

            /**
             * Return a flash waiting message.
             *
             * @param   String      index       Desired flash message type.
             * @returns String
             */
            Get: function(index) {
                return data[index] || '';
            },

            /**
             * Check to see if a flash message is waiting
             *
             * @param   String      target      [optional] Desired flash message type.
             * @returns boolean
             */
            Exists: function(target) {
                var result = false;

                if (!target) {
                    // No specific check requested
                    if (data && (data.success || data.info || data.warn || data.error)) {
                        result = true;
                    }
                } else {
                    if (data && data[target]) {
                        result = true;
                    }
                }

                return result;
            }

        }
    })