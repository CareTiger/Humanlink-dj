/**
 * Controller for the Nearme view.
 */
(function () {
    'use strict';

    Nearme.$inject = ["$scope", "$window", "CommonService", "CommonEvents", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Nearme', Nearme);

    /** @ngInject */
    function Nearme($scope, $window, CommonService, CommonEvents, Session, AccountRepo, SiteAlert,
                    underscore) {

        var nearme = {};
        var vm = this;
        vm.nearme = nearme;
        vm.submitBusy = false;
        vm.search = search;

        init();
        function init() {
            vm.submitBusy = true;
            console.log('Get Nearme Profile');

            AccountRepo.search().then(
                function (data) {
                    vm.submitBusy = false;
                    vm.nearme = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }

        function search(model) {
            vm.submitBusy = true;
            console.log(model);
            AccountRepo.search(model).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.nearme = data.data.response;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();