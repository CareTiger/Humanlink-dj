/**
 * Factory that manages the state of the thread sidepanel.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard.thread')
        .factory('SidepanelState', SidepanelState);

    /** ngInject */
    function SidepanelState() {

        var sidepanel = {
            isOpen: false,
            state: '',
            close: close,
            open: open,
            setState: setState
        };

        return sidepanel;

        function open() {
            sidepanel.isOpen = true;
        }

        function close() {
            sidepanel.isOpen = false;
        }

        function setState(stateName) {
            sidepanel.state = stateName;
        }

    }

})();