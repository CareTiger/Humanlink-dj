/**
 * Create thread controller.
 */
(function () {
    'use strict';

    CreateThread.$inject = ["$log", "CommonService", "MessagesRepo"];
    angular
        .module('app.dashboard')
        .controller('CreateThread', CreateThread);

    /** @ngInject */
    function CreateThread($log, CommonService, MessagesRepo) {
        var vm = this;

        vm.errorMessage = null;
        vm.submitBusy = false;

        vm.thread = null;
        vm.createThread = createThread;
        vm.cancel = cancel;


        init();

        function init() {
            $log.debug('create_thread init');
            vm.type = 'option1';

            //has to be move to constants file
            vm.careServices = [
                {
                    "value": 0,
                    "name": "Companion",
                    "description": "Companionship",
                    "skills": "All things companions do"
                },
                {
                    "value": 1,
                    "name": "Grooming",
                    "description": "Personal Grooming",
                    "skills": "Bathing and dressing"
                },
                {
                    "value": 2,
                    "name": "Meals",
                    "description": "Meal Preparations",
                    "skills": "Hot/cold meal preparations"
                },
                {
                    "value": 3,
                    "name": "Housekeeping",
                    "description": "Housekeeping",
                    "skills": "Housekeeping - Laundry and cleaning"
                },
                {
                    "value": 4,
                    "name": "Medication",
                    "description": "Medication reminders",
                    "skills": "Medication reminders"
                },
                {
                    "value": 5,
                    "name": "Transportation",
                    "description": "Transportation",
                    "skills": "Transportation from home to clinic and back"
                },
                {
                    "value": 6,
                    "name": "Alzheimers",
                    "description": "Alzheimer's and Dementia",
                    "skills": "Companionship, Mental simulation, 24-hour care"
                },
                {
                    "value": 7,
                    "name": "Mobility",
                    "description": "Mobility assistance",
                    "skills": "Mobility assistance"
                }
            ];
        }

        function createThread(model) {
            vm.submitBusy = true;
            model = {
                name: model.name,
                purpose: model.purpose
            };

            MessagesRepo.create(model).then(
                function (thread) {
                    console.log(thread.owner);
                    CommonService.hardRedirect('/app/c/' + thread.owner.id + '/' + thread.name);
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