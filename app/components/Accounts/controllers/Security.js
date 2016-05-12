(function () {
    'use strict';

    Security.$inject = ["$scope", "SettingsRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.account')
        .controller('Security', Security);

    /* @ngInject */
    function Security($scope, SettingsRepo,
                      CommonService, CommonEvents, SiteAlert) {
        var vm = this;
        vm.settings = null;
        vm.changePassword = changePassword;
        vm.closeAccount = closeAccount;
        vm.password = {};

        vm.errorMessagePasswordChange = null;
        vm.errorMessageAccountClose = null;
        vm.submitBusy = false;

        vm.reasons = [
            {"value": 0, "name": "Duplicate", "description": "I have a duplicate account"},
            {"value": 1, "name": "Dontneed", "description": "I don't need the services anymore."},
            {"value": 2, "name": "Different", "description": "I am using a different professional service."},
            {"value": 3, "name": "Other", "description": "Other Reasons"}
        ];

        init();
        function init() {
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
            });
        }

        function changePassword(oldpwd, newpwd) {
            console.log(oldpwd)
            console.log(newpwd)
            vm.submitBusy = true;
            vm.errorMessagePasswordChange = null;
            var model = {oldvalue: oldpwd, newValue: newpwd};

            SettingsRepo.changePassword(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your password has been changed.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessagePasswordChange = data;
                });
        }

        function closeAccount(reason) {
            if (window.confirm("Do you really want to close your account?")) {
                vm.submitBusy = true;
                vm.errorMessageAccountClose = null;
                SettingsRepo.closeAccount(reason).then(
                    function (data) {
                        SiteAlert.success("Your account is now closed.");
                        CommonService.hardRedirect('/logout');
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessageAccountClose = data;
                    });
            }
        }

    }

})();