(function () {
    'use strict';

    CommonService.$inject = ["$q", "$log", "$rootScope", "$window"];
    angular
        .module('app.common')
        .factory('CommonService', CommonService);

    /** ngInject */
    function CommonService($q, $log, $rootScope, $window) {

        return {
            broadcast: broadcast,
            on: on,
            previous: previous,
            hardRedirect: hardRedirect
        };

        /**
         * Broadcasts an event at the `$rootScope` level.
         * Alias to `$rootScope.$broadcast`.
         */
        function broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        /**
         * Listens to a given event at the `$rootScope` level.
         * Alias to `$rootScope.$on`.
         */
        function on() {
            return $rootScope.$on.apply($rootScope, arguments);
        }

        /**
         * Go back to the previous page or view.
         */
        function previous() {
            $window.history.back();
        }

        /**
         * Performs a hard redirect (full page refresh) to a URL.
         * @param url
         */
        function hardRedirect(url) {
            $window.location.href = '/r?url=' + decodeURIComponent(url);
        }

    }

})();