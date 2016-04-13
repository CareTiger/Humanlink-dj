(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('Config', getConfig());

    function getConfig() {

        return {
            api_path: '/api/internal',

            pusher: {
                // TODO: add environment-based configs values.
                key: 'feea095554f736862bf4',
                options: {
                    encrypted: true
                }
            }
        };
    }

})();
