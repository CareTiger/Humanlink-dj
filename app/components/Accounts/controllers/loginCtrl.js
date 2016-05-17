/**
 * Created by timothybaney on 5/16/16.
 */

/**
 * Controller for the login view.
 */
(function () {
    'use strict';

    Ctrl.$inject = ["$scope", "$window", "$stateParams", "apiService"];
    angular
        .module('app.account')
        .controller('loginCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $window, $stateParams, apiService) {
        // Reference to the base ctrlHelper.
        var ctrlHelper = $scope.$parent.ctrlHelper;
        ctrlHelper.reset();

        $scope.loginModel = {
            email: '',
            password: ''
        };

        $scope.login = function (model) {
            ctrlHelper.reset();
            if (!model.email || !model.password) {
                return;
            }
            ctrlHelper.success = function (data, status, headers, config) {
                console.log('HEY! Remove the /r absolute URL once migrated to the new backend.');
                var redirector = 'http://eb.humanlink.co/r?url=';
                var next = $stateParams.next || HL.baseUrl + '/accounts#/settings/profile';
                //$window.location.href = redirector + decodeURIComponent(next);
                $window.location.href = '/home#/search';
            };
            apiService.Accounts.login(model, ctrlHelper);
        };
    }

})();