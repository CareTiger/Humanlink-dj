/**
 * Controller for the CaregiverProfile view.
 */
(function () {
    'use strict';

    CaregiverProfile.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore", "$stateParams"];
    angular
        .module('app.account')
        .controller('CaregiverProfile', CaregiverProfile);

    /** @ngInject */
    function CaregiverProfile($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                              underscore, $stateParams) {

        var caregiverProfile = {};
        var vm = this;
        vm.caregiverProfile = caregiverProfile;
        vm.submitBusy = false;
        vm.connect = connect;
        vm.back = back;
        vm.caregiverProfile.email = $stateParams.id;

        init();
        function init() {
            vm.submitBusy = true;
            AccountRepo.caregiver_info(vm.caregiverProfile).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.caregiverProfile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function connect() {
            vm.submitBusy = true;
            AccountRepo.connect($stateParams.id).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your invitation to " + $stateParams.id + " has been sent and " + $stateParams.id + " has been added to your welcome channel.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function back(){
            CommonService.previous();
        }
    }

})();