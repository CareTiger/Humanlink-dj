(function () {
    'use strict';

    angular
        .module('app.settings')
        .controller('Payments', Payments);

    /* @ngInject */
    function Payments($scope, SettingsRepo,
                      CommonService, CommonEvents) {
        var vm = this;
        vm.settings = null;
        vm.deletePayment = deletePayment;
        vm.addPayment = addPayment;

        vm.saveIsDisabled = false;

        init();
        function init() {
            load();
        }

        function load() {
            SettingsRepo.getSettings().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.payment = data.payment;
            });
        }

        function deletePayment() {
            SettingsRepo.deletePayment().then(function (data) {
                CommonService.broadcast(CommonEvents.viewReady);
                vm.payment = "";
            });
        }

        function addPayment(paymentMethod) {
            vm.saveIsDisabled = true;
            SettingsRepo.addPayment(paymentMethod).then(function (data) {
                vm.payment = data.payment;
                vm.saveIsDisabled = false;
            });
        }

    }

})();