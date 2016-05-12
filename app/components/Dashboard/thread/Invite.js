/**
 *  Controller for the thread Invite.
 */
(function () {
    'use strict';

    Invite.$inject = ["$scope", "$log", "CommonService", "CommonEvents", "SiteAlert", "MessagesRepo", "threadInfo"];
    angular
        .module('app.dashboard.thread')
        .controller('Invite', Invite);

    /** @ngInject */
    function Invite($scope, $log,
                  CommonService, CommonEvents, SiteAlert,
                  MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.sendInvite = sendInvite;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Invite init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function sendInvite(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.invite(vm.thread.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invite has been sent to " + model.email);
                    vm.invite = null;
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