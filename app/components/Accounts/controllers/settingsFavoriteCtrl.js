/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the favorite caregivers sub-page of settings
 */
(function () {
    Ctrl.$inject = ["$scope"];
    angular
        .module('app.account')
        .controller('settingsFavoritesCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope) {
        $scope.favorites = [
            {"name": "Jane Caregiver", "status": "I am currently available from M-F from 9-5"},
            {"name": "Sarah Caregiver", "status": "I am available for live-in and live-out"},
            {"name": "Zoe Caregiver", "status": "I am on vacation till August 15th"},
            {"name": "Amanda Caregiver", "status": "I am on vacation till August 10th"},
        ];
    }

})();