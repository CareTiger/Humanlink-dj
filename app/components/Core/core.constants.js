/**
 * Created by timothybaney on 6/15/16.
 */

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
                key: 'feea095554f736862bf4',
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