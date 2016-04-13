/**
 *  Controller for the team view.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard.team')
        .controller('Team', Team);

    /** @ngInject */
    function Team($log, orgInfo) {
        var vm = this;

        init();

        function init() {
            $log.debug('team init');
            vm.org = orgInfo;
        }

    }

})();
