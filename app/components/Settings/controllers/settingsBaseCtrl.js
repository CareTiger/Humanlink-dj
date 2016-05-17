/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the settings module.
 */
angular
    .module('app.settings')
    .controller('settingsBaseCtrl', ['$scope', '$window', function ($scope, $window) {

        // CtrlHelper that is shared between the parent and all children.
        $scope.ctrlHelper = new HL.CtrlHelper();

        /**
         * Go back to the previous page/view.
         * @return void
         */
        $scope.previous = function () {
            $window.history.back();
        };

    }]);