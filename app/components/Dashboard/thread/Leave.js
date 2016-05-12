/**
 *  Controller for the thread Leave.
 */
(function () {
    'use strict';

    Leave.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Leave', Leave);

    /** @ngInject */
    function Leave($scope, $log, $state,
                   CommonService, CommonEvents,
                   MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.leave = leave;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Leave init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function leave() {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.leave(vm.thread.id).then(
                function (data) {
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