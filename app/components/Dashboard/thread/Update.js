/**
 *  Controller for the thread Update.
 */
(function () {
    'use strict';

    Update.$inject = ["$scope", "$log", "$state", "CommonService", "CommonEvents", "MessagesRepo", "threadInfo", "SiteAlert"];
    angular
        .module('app.dashboard.thread')
        .controller('Update', Update);

    /** @ngInject */
    function Update($scope, $log, $state,
                    CommonService, CommonEvents,
                    MessagesRepo, threadInfo, SiteAlert) {
        var vm = this;
        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.type = true;
        vm.UpdateInfo = UpdateInfo;
        vm.cancel = cancel;
        vm.careServices = {Blue: true, Orange: true};

        init();

        function init() {
            console.log('UPDATE INIT2');
            vm.thread = threadInfo.thread;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function UpdateInfo(model) {

            vm.submitBusy = true;
            vm.errorMessage = null;

            //currently supporting Basic channel purpose only
            model = {
                name: vm.thread.name,
                purpose: vm.thread.purpose,
                purpose_type: vm.thread.purpose_type,
                hours: vm.thread.hours,
                notes: vm.thread.notes,
                gender: vm.thread.gender,
                hobbies: vm.thread.hobbies,
            };

            MessagesRepo.updatePurpose(vm.thread.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your update was successful.");
                    SiteAlert.check();
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                }
            );

        }

        function cancel() {
            CommonService.previous();
        }
    }

})();