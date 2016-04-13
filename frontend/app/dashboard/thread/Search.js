/**
 *  Controller for the thread Caregiver search.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard.thread')
        .controller('Search', Search);

    /** @ngInject */
    function Search($scope, $log, $http,
                  CommonService, CommonEvents,
                  MessagesRepo, threadInfo) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.search = search;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('Invite init');
            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        // Any function returning a promise object can be used to load values asynchronously
        $scope.getLocation = function (val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        };

        function search(model) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            MessagesRepo.search(model).then(
                function (data) {
                    vm.submitBusy = false;
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();