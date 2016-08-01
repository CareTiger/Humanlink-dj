/**
 * Controller for the CareseekerProfile view.
 */
(function () {
    'use strict';

    CareseekerProfile.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore", "$stateParams"];
    angular
        .module('app.account')
        .controller('CareseekerProfile', CareseekerProfile);

    /** @ngInject */
    function CareseekerProfile($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                               underscore, $stateParams) {

        var careseekerProfile = {};
        var vm = this;
        vm.careseekerProfile = careseekerProfile;
        vm.submitBusy = false;
        vm.connect = connect;
        vm.careseekerProfile.email = $stateParams.id;

        init();
        function init() {
            vm.submitBusy = true;
            AccountRepo.careseeker_info(vm.careseekerProfile).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.careseekerProfile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function connect() {
            vm.submitBusy = true;
            console.log("Connect careseeker team");
        }

    }

})();