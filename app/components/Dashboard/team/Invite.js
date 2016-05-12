/**
 *  Controller for the invite view.
 */
(function () {
    'use strict';

    Invite.$inject = ["$log", "CommonService", "SiteAlert", "OrgsRepo", "orgInfo"];
    angular
        .module('app.dashboard.team')
        .controller('OrgInvite', Invite);

    /** @ngInject */
    function Invite($log, CommonService, SiteAlert, OrgsRepo, orgInfo) {
        var vm = this;

        vm.org = null;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.sendInvite = sendInvite;
        vm.cancelInvite = cancelInvite;
        vm.invite = null;

        init();

        function init() {
            $log.debug('invite init');
            vm.org = orgInfo;
        }

        function sendInvite(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            OrgsRepo.sendInvite(vm.org.id, model).then(
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

        function cancelInvite() {
            CommonService.previous();
        }
    }

})();