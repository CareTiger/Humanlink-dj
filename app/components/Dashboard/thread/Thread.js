/**
 * Parent controller for the `dashboard.messages` state.
 */
(function () {
    'use strict';

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
            }
        }

        function toggleSidepanel() {
            return SidepanelState.isOpen ? closeSidepanel() : openSidepanel();
        }

        function openSidepanel() {
            var st = SidepanelState.state;
            return $state.go(st || 'dashboard.messages.default.sidepanel.default');
        }

        function closeSidepanel() {
            SidepanelState.close();
            return $state.go('dashboard.messages.default');
        }

    }

})();