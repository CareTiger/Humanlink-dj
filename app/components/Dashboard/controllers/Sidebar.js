/**
 * Controller for the sidebar view.
 */
(function () {
    'use strict';

    Sidebar.$inject = ["$scope", "$log", "MessagesService"];
    angular
        .module('app.dashboard')
        .controller('Sidebar', Sidebar);

    /** @ngInject */
    function Sidebar($scope, $log, MessagesService) {
        var vm = this;
        vm.orgs = null;

        init();

        function init() {

            MessagesService.getThreads().then(function (threads) {
                $log.debug('sidebar init');
                vm.threads = threads;
            });
        }
    }

})();