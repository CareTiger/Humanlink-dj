/**
 * Controller for the join view.
 */
(function () {
    'use strict';

    Join.$inject = ["$log", "$anchorScroll", "$state", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Join', Join);

    /** @ngInject */
    function Join($log, $anchorScroll, $state, $stateParams,
                  AccountRepo, CommonService, CommonEvents, SiteAlert) {
        var vm = this;

        var defaultModel = {
            email: '',
            password: '',
            password_confirm: '',
            invite: '',
            org_name: '',
            org_username: ''
        };

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.signup = angular.copy(defaultModel);

        vm.cancel = cancel;
        vm.next = next;
        vm.previous = previous;
        vm.join = join;

        init();

        function init() {
            if ($stateParams.invite) {
                vm.signup.invite = $stateParams.invite;
            }
            CommonService.broadcast(CommonEvents.viewReady);
        }

        function join(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            AccountRepo.join(model).then(
                function (data) {
                    CommonService.hardRedirect('/accounts#/edit');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                    $anchorScroll('join-view');
                });
        }

        function cancel() {
            CommonService.previous();
        }

        /**
         * Go to next section of registration.
         */
        function next(model) {
            vm.submitBusy = true

            console.log(model)

            // TODO: maybe perform email verification (HTTP call) here.
            AccountRepo.check_availability(model.email).then(function(data){
                var account = data.data.response.account
                if (account === false) {
                    $state.go('auth.join.team')
                    vm.submitBusy = false
                } else {
                    SiteAlert.danger('Email is already in use')
                }
            })
        }

        /**
         * Go to previous section of registration.
         */
        function previous() {
            $state.go('auth.join.personal');
        }

    }

})();