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


        init();

        function init() {
            $log.debug('Update init');
            vm.thread = threadInfo.thread;

            CommonService.broadcast(CommonEvents.viewReady);
        }

        function UpdateInfo(model) {

            vm.submitBusy = true;
            vm.errorMessage = null;

            //currently supporting Basic channel purpose only
            model = {
                name: vm.thread.name,
                purpose: vm.thread.purpose
            };

            MessagesRepo.update(vm.thread.id, model).then(
                function (data) {
                    vm.submitBusy = false;
                    SiteAlert.success("Your channel information update was successful.");
                    SiteAlert.check()
                    // CommonService.previous();
                    $state.go('dashboard.messages', {thread: vm.thread.name})
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