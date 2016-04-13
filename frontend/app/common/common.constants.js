(function () {
    'use strict';

    angular
        .module('app.common')
        .constant('CommonEvents', getEvents());

    /**
     * Common event names.
     * @returns {{viewLoading: string, viewReady: string}}
     */
    function getEvents() {
        return {
            viewLoading: 'viewLoading',
            viewReady: 'viewReady'
        };
    }

})();
