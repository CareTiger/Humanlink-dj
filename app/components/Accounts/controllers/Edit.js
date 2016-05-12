/**
 * Controller for the account edit view.
 */
(function () {
    'use strict';

    Edit.$inject = ["$scope", "$window", "CommonService", "Session", "AccountRepo", "SiteAlert", "underscore"];
    angular
        .module('app.account')
        .controller('Edit', Edit);

    /** @ngInject */
    function Edit($scope, $window, CommonService, Session, AccountRepo, SiteAlert,
                  underscore) {

        var userData = Session.account;
        var profile = underscore.pick(userData, ['username', 'first', 'last', 'email',
            'phone_number', 'email_verified']);

        var vm = this;
        vm.profile = profile;
        vm.submitBusy = false;
        vm.update = update;

        function update(model) {
            vm.submitBusy = true;
            AccountRepo.save(model).then(
                function (data) {
                    console.log(data)
                    if (userData.first !== data.first || userData.last !== data.last) {
                        CommonService.hardRedirect($window.location.pathname);
                        return;
                    }
                    vm.submitBusy = false;
                    SiteAlert.success("Your account has been updated.");
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                });
        }
    }

})();