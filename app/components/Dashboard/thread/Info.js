/**
 *  Controller for the thread Info.
 */
(function () {
    'use strict';

    Info.$inject = ["$scope", "$log", "$window", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Info', Info);

    /** @ngInject */
    function Info($scope, $log, $window,
                  CommonService, CommonEvents,
                  MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.removeMember = removeMember;

        init();

        function init() {
            $log.debug('Info init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function removeMember(threadId, memberId) {
            if ($window.confirm('You are trying to remove a member. Are u sure?')) {
                var model = {
                    thread_id: threadId,
                    member_id: memberId
                };
                vm.submitBusy = true;
                MessagesRepo.removeMember(model).then(
                    function (data) {
                        $log.debug("Removed member " + vm.thread.member.name);
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessage = data;
                        $log.debug(vm.errorMessage);
                    });

            }
        }

    }

})();