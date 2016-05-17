/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';
(function () {
    Ctrl.$inject = ["$scope", "$state", "Constants", "apiService", "siteAlert"];
    angular
        .module('app.account')
        .controller('settingsRecipientsCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $state, Constants, apiService, siteAlert) {

        $scope.recipients = null;
        $scope.edit = edit;
        $scope.archive = archive;

        init();
        function init() {
            var initReq = new HL.CtrlHelper();
            initReq.success = function (data, status) {
                $scope.recipients = data.items || [];
            };
            initReq.failure = function (data, status) {
                siteAlert.error(data);
            };
            apiService.Accounts.patients.list(initReq);
        }

        function edit(model) {
            $state.go('settings.new_recipient.who', {model: model});
        }

        function archive(model) {
            siteAlert.clear();
            if (!window.confirm("Are you sure?")) {
                return;
            }
            model.isLoading = true;
            var archiveReq = new HL.CtrlHelper();
            var ind = $scope.recipients.indexOf(model);
            $scope.recipients.splice(ind, 1);

            // Restore.
            archiveReq.failure = function (data, status) {
                siteAlert.error('Care recipient could not be archived.');
                model.isLoading = false;
                $scope.recipients.splice(ind, 0, model);
            };
            apiService.Accounts.patients.remove(model.id, archiveReq);
        }
    }

})();