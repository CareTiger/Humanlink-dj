/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Caregiver controller
 */
angular
    .module('Home')
    .controller('caregiverCtrl', ['$scope', '$window', function ($scope, $window) {

        $scope.SignUp = function (){
            console.log("Hello");
            $window.location.href = '/home/join';
        };
    }]);