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
            AccountRepo.updateTeam(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your team information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();