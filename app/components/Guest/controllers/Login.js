/**
 * Controller for the login view.
 */
(function () {
    'use strict';

    Login.$inject = ["$log", "$anchorScroll", "$stateParams", "AccountRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.guest')
        .controller('Login', Login);

    /** @ngInject */
    function Login($log, $anchorScroll, $stateParams,
                  AccountRepo, CommonService, CommonEvents, SiteAlert) {
        var vm = this;

        var next = null;
        var defaultAuth = {
            email: '',
            password: '',
        };

        vm.errorMessage = null;
        vm.submitBusy = false;
        vm.auth = angular.copy(defaultAuth);
        vm.login = login;

        init();

        function init() {
            CommonService.broadcast(CommonEvents.viewReady);
            next = $stateParams.next;
        }

        function login(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;
            AccountRepo.login(model).then(
                function (data) {
                    CommonService.hardRedirect(next || '/app');
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                    $anchorScroll('login-view');
                });
        }
    }

})();