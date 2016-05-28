/**
 *  Controller for the thread pending invitations.
 */
(function () {
    'use strict';

    Pending.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Pending', Pending);

    /** @ngInject */
    function Pending($scope, $log, $state,
                   CommonService, CommonEvents,
                   MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Pending init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function cancel() {
            CommonService.previous();
        }
    }

})();