/**
 * Controller for the accept view.
 */
(function () {
    'use strict';

    angular
        .module('app.guest')
        .controller('Accept', Accept);

    /** @ngInject */
    function Accept($log, $state, $stateParams, $location, $anchorScroll,
                    AccountRepo, CommonService, CommonEvents) {
        var vm = this;

        var views = {
            default: 'default',
            invalid: 'invalid',
            used: 'used'
        };

        vm.messages = {
            signup: null,
            login: null
        };
        vm.spinners = {
            signup: false,
            login: false
        };
        vm.view = views.default;
        vm.invite = null;
        vm.signupModel = null;
        vm.loginModel = null;

        vm.signup = signup;
        vm.login = login;

        vm.gotoLogin = gotoLogin;

        init();

        function init() {
            // Pre-fetched data can come as a URL parameter (`data`).
            var data = angular.fromJson($stateParams.data);

            // Delete `data` parameter from URL.
            $state.go('.', {data: null}, {location: 'replace'});

            // Impossible token.
            if ($stateParams.token.length < 8) {
                return ready();
            }
            if (data) {
                return ready(data);
            }

            AccountRepo.invite($stateParams.token).then(ready, ready);

            function ready(invite) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.invite = invite;

                if (!vm.invite || (vm.invite && vm.invite.invalid)) {
                    vm.view = views.invalid;
                    return;
                }
                if (vm.invite.used) {
                    vm.view = views.used;
                    return;
                }
                vm.signupModel = {email: vm.invite.email};
                vm.loginModel = {email: vm.invite.email};
            }
        }

        function signup(model) {
            vm.spinners.signup = true;
            vm.messages.signup = null;
            AccountRepo.accept(withToken(model)).then(
                function () {
                    return CommonService.hardRedirect('/account#/edit');
                },
                function (data) {
                    vm.spinners.signup = false;
                    vm.messages.signup = data;
                    $location.hash('signup-view');
                    $anchorScroll();
                }
            );
        }

        function login(model) {
            vm.spinners.login = true;
            vm.messages.login = null;
            AccountRepo.login(withToken(model)).then(
                function () {
                    return CommonService.hardRedirect('/app');
                },
                function (data) {
                    vm.spinners.login = false;
                    vm.messages.login = data;
                    gotoLogin();
                }
            );
        }

        function withToken(model) {
            return angular.extend(model, {token: vm.invite.token});
        }

        function gotoLogin() {
            $location.hash('login-view');
            $anchorScroll();
        }
    }

})();
