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
    function $pusher() {
        var self = this;
        self.client = new Pusher('2676265f725e22f7e5d0', {
          cluster: 'mt1',
          encrypted: true
        });

        return {
            client: self.client
        };
    }

})();