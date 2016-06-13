(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('Config', getConfig());

    function getConfig() {

        return {
            api_path: '',

            pusher: {
                // TODO: add environment-based configs values.
                key: '2676265f725e22f7e5d0',
                options: {
                    encrypted: true
                    // auth: {
                    //     headers: {
                    //         'X-CSRFToken': 'ih3Kz95cZcjs69BMTHI14cNQO4naGTgR',
                    //     //    Token needs to be dynamic
                    //     }
                    // }
                }
            }
        };
    }

})();