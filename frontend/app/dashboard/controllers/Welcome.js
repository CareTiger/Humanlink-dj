/**
 * Controller for the dashboard welcome state.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Welcome', Welcome);

    /** @ngInject */
    function Welcome($log, NotificationManager) {
        var vm = this;
        vm.nagDesktopNotifications = !NotificationManager.isGranted();

        vm.enableNotifications = enableNotifications;

        init();

        function init() {
            $log.debug('welcome init');
            if (NotificationManager.permission === 'denied') {
                vm.view = 'denied';
            }
        }

        function enableNotifications() {
            vm.view = 'hints';
            NotificationManager.requestPermission().then(function (permission) {
                vm.view = permission;
            });
        }
    }

})();