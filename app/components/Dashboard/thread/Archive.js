/**
 *  Controller for the thread Archive.
 */
(function () {
    'use strict';

    Archive.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Archive', Archive);

    /** @ngInject */
    function Archive($scope, $log, $state,
                     CommonService, CommonEvents,
                     MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.archive = archive;
        vm.cancel = cancel;

        init();

        function init() {
            $log.debug('Archive init');
            vm.thread = threadInfo.thread;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function archive() {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.archive(vm.thread.id).then(
                function () {
                    vm.submitBusy = false;
                    $state.go('dashboard.default');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function cancel() {
            CommonService.previous();
        }
    }

})();