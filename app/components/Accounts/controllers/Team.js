/**
 * Controller for the account Team profile view.
 */
(function () {
    'use strict';

    Team.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Team', Team);

    /** @ngInject */
    function Team($scope, $window, CommonService, Session, AccountRepo, SiteAlert,
                  underscore) {

        var team = {};
        var vm = this;
        vm.team = team;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Team Profile');
            AccountRepo.getTeam().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.team = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function update(model) {
            vm.submitBusy = true;
            if (vm.team.public){
                vm.team.public = 'True';
            } else {
                vm.team.public = 'False';
            }
            if (vm.team.meal_prep){
                vm.team.meal_prep = 'True';
            } else {
                vm.team.meal_prep = 'False';
            }
            if (vm.team.housekeeping){
                vm.team.housekeeping = 'True';
            } else {
                vm.team.housekeeping = 'False';
            }
            if (vm.team.hoyer_lift){
                vm.team.hoyer_lift = 'True';
            } else {
                vm.team.hoyer_lift = 'False';
            }
            if (vm.team.cough_assist){
                vm.team.cough_assist = 'True';
            } else {
                vm.team.cough_assist = 'False';
            }
            if (vm.team.adaptive_utensil){
                vm.team.adaptive_utensil = 'True';
            } else {
                vm.team.adaptive_utensil = 'False';
            }
            AccountRepo.updateTeam(model).then(
                function (data) {
                    vm.submitBusy = false;
                    console.log(vm.team);
                    SiteAlert.success("Your team information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();