/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the verification subpage of settings
 */
angular
    .module('app.account')
    .controller('settingsVerificationCtrl', ['$scope', function ($scope) {

        $scope.account = {
            emailVerified: true,
            phoneVerified: true,
            backgroundVerified: false
        };

        $scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
            'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD',
            'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        $scope.chosenDLState = $scope.states[0];
        $scope.chosenAddrState = $scope.states[0];
    }]);