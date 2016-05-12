(function () {
    'use strict';

    Notifications.$inject = ["$scope", "SettingsRepo", "CommonService", "CommonEvents", "SiteAlert"];
    angular
        .module('app.settings')
        .controller('Notifications', Notifications);

    /** @ngInject */
    function Notifications($scope, SettingsRepo,
                           CommonService, CommonEvents, SiteAlert) {
        var vm = this;
        vm.settings = null;
        vm.updateSMSSettings = updateSMSSettings;
        vm.updateEmailSettings = updateEmailSettings;

        vm.errorMessageSMSSettings = null;
        vm.errorMessageEmailSettings = null;
        vm.submitBusy = {
            sms_spinner: false,
            email_spinner: false
        };

        init();
        function init() {
            console.log('Notifications Init')
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.notifications = data.notifications;
            });
        }

        function updateSMSSettings(notifications) {
            vm.submitBusy.sms_spinner = true;
            SettingsRepo.updateNotifications(notifications).then(
                function (data) {
                    vm.submitBusy.sms_spinner = false;
                    SiteAlert.success("SMS Settings were updated successfully.");
                },
                function (data) {
                    vm.submitBusy.sms_spinner = false;
                    vm.errorMessageSMSSettings = data;
                });
        }

        function updateEmailSettings(notifications) {
            vm.submitBusy.email_spinner = true;
            SettingsRepo.updateNotifications(notifications).then(
                function (data) {
                    vm.submitBusy.email_spinner = false;
                    SiteAlert.success("Email Settings were updated successfully.");
                },
                function (data) {
                    vm.submitBusy.email_spinner = false;
                    vm.errorMessageEmailSettings = data;
                });
        }

    }

})();