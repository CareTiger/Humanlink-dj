/**
 * pusher-js wrapper as a factory.
 * Docs: https://github.com/pusher/pusher-js
 */
(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('$pusher', $pusher);

    /** ngInject */
    function $pusher(Config) {
        var self = this;
        self.client = new Pusher(Config.pusher.key, Config.pusher.options || {});

        return {
            client: self.client
        };
    }

})();