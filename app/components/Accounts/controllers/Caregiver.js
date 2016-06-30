/**
 * Controller for the account Caregiver profile view.
 */
(function () {
    'use strict';

    Caregiver.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert"];
    angular
        .module('app.account')
        .controller('Caregiver', Caregiver);

    /** @ngInject */
    function Caregiver($scope, $window, CommonService, Session, AccountRepo, SiteAlert) {

        var cvgr = {};
        var vm = this;
        vm.cvgr = cvgr;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Caregiver Profile');
            AccountRepo.getCaregiver().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.cvgr = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function update(model) {
            vm.submitBusy = true;
            AccountRepo.updateCaregiver(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your Caregiver information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();