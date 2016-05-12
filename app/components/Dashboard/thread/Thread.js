/**
 * Parent controller for the `dashboard.messages` state.
 */
(function () {
    'use strict';

    Thread.$inject = ["$log", "$state", "$stateParams", "SidepanelState"];
    angular
        .module('app.dashboard')
        .controller('Thread', Thread);

    /** @ngInject */
    function Thread($log, $state, $stateParams, SidepanelState) {
        var vm = this;

        vm.sidepanel = SidepanelState;
        vm.toggleSidepanel = toggleSidepanel;
        vm.openSidepanel = openSidepanel;
        vm.closeSidepanel = closeSidepanel;

        init();

        function init() {
            $log.debug('thread init');

            if (SidepanelState.isOpen) {
                return openSidepanel();
            } else {
                return closeSidepanel()
            }
        }

        function toggleSidepanel() {
            return SidepanelState.isOpen ? closeSidepanel() : openSidepanel();
        }

        function openSidepanel() {
            vm.sidepanel.open()
            var st = SidepanelState.state;
            return $state.go(st || 'dashboard.messages.default.sidepanel.default');
        }

        function closeSidepanel() {
            vm.sidepanel.close()
            SidepanelState.close();
            return $state.go('dashboard.messages.default');
        }

    }

})();