/**
 *  Controller for the team view.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard.team')
        .controller('Directory', Directory);

    /** @ngInject */
    function Directory($log, OrgService, orgInfo) {
        var vm = this;

        vm.org = null;
        vm.memberName = memberName;

        init();

        function init() {
            $log.debug('directory init');
            vm.org = orgInfo;
        }

        function memberName(member) {
            return OrgService.memberName(member);
        }
    }

})();
