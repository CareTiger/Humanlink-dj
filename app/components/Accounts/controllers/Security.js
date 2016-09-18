(function () {
    'use strict';

    Security.$inject = ["$scope", "SettingsRepo", "AccountRepo", "CommonEvents", "SiteAlert"];
    angular
        .module('app.account')
        .controller('Security', Security);

    /* @ngInject */
    function Security($scope, SettingsRepo,
                      AccountRepo, CommonEvents, SiteAlert) {
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
            {"value": 1, "name": "Don't need", "description": "I don't need the services anymore."},
            {"value": 2, "name": "Different", "description": "I am using a different professional service."},
            {"value": 3, "name": "Other", "description": "Other Reasons"}
        ];

        init();
        function init() {
            console.log('Update password');
        }

        function changePassword(model) {
            vm.submitBusy = true;
            vm.errorMessagePasswordChange = null;

            AccountRepo.resetPassword(model).then(
                function(data){
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
                        //CommonService.hardRedirect('/logout');
                    },
                    function (data) {
                        vm.submitBusy = false;
                        vm.errorMessageAccountClose = data;
                    });
            }
        }

    }

})();