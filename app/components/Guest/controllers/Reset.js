/**
 * Controller for the reset view.
 */
(function () {
    'use strict';

    Reset.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Reset', Reset);

    /** @ngInject */
    function Reset($log, $anchorScroll, $stateParams,
                   AccountRepo, CommonService, CommonEvents, SiteAlert) {

        var vm = this;
        var next = null;

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.reset = reset;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function reset(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.resetPasswordEmail(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your reset password email is on the way.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }
    }

})();