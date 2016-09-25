/**
 * Controller for the Verify view.
 */
(function () {
    'use strict';

    Verify.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Verify', Verify);

    /** @ngInject */
    function Verify($log, $anchorScroll, $stateParams,
                    AccountRepo, CommonService, CommonEvents, SiteAlert) {

        var vm = this;
        var next = null;

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.verify = verify;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function verify(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.verifyEmail(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your email was successfully verified.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }
    }

})();