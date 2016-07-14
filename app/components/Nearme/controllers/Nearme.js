/**
 * Controller for the Nearme view.
 */
(function () {
    'use strict';

    Nearme.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "NearmeRepo", "SiteAlert", "underscore"];
    angular
        .module('app.nearme')
        .controller('Nearme', Nearme);

    /** @ngInject */
    function Nearme($scope, $window, CommonService, CommonEvents, Session, NearmeRepo, SiteAlert,
                    underscore) {

        var nearme = {};
        var vm = this;
        vm.nearme = nearme;
        vm.submitBusy = false;
        vm.update = update;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Nearme Profile');
            NearmeRepo.search().then(
                function (data) {
                    vm.submitBusy = false;
                    CommonService.broadcast(CommonEvents.viewReady);
                    vm.profile = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    CommonService.broadcast(CommonEvents.viewReady);
                    vm.errorMessage = data;
                });

            vm.nearme = {
                'team_name': "My team",
                'mission': "Lower the cost of in home care",
                'care_needs': "1) 4 hours respite care coverage Saturday 12pm-4pm 2) 2 hours ongoing care Tuesdays 7am – 9am 3) 1 overnight care Friday 6pm – Saturday 10am",
                'first': "Goofy",
                'last': "dog",
                'headline': "I am available M-F from 1-4 pm",
                'bio': "humanlink is built on trust. Our care seekers want to know that you are compassionate and caring. This is your opportunity to let them know about you. Taking a few minutes to build an awesome online profile can increase your chances of getting hired",
            }

        }

        function update(model) {
            vm.submitBusy = true;
            AccountRepo.updateTeam(model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your nearme information has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();