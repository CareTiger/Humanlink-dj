/**
 * Controller for the sidepanel in the thread view.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Sidepanel', Sidepanel);

    /** @ngInject */
    function Sidepanel($log, $state, SidepanelState) {
        var vm = this;

        init();

        function init() {
            $log.debug('sidepanel init');
            SidepanelState.setState($state.current.name);
            SidepanelState.open();
        }
    }

})();