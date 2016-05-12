/**
 * Service that controls the site alert that is attached to the root scope.
 *
 * Site alerts are alert messages that are displayed at the top of the website.
 * They are useful for displaying one-time (flash) messages.
 *
 * Future enhancements:
 *  - Inject HTML
 *  - Auto-dismiss
 */

(function () {
    'use strict';

    SiteAlert.$inject = ["$rootScope"];
    angular
        .module('app.common')
        .factory('SiteAlert', SiteAlert);

    /** ngInject */
    function SiteAlert($rootScope) {

        $rootScope.siteAlert = {};

        var alertBox = $rootScope.siteAlert;

        return {
            clear: clear,
            success: success,
            error: danger,
            danger: danger,
            warning: warning,
            info: info,
            check: checkAlert,
        };

        function checkAlert(){
            console.log(alertBox)
        }

        function clear() {
            addAlert(null, null);
        }

        function success(content) {
            addAlert('success', content);
        }

        function danger(content) {
            addAlert('danger', content);
        }

        function warning(content) {
            addAlert('warning', content);
        }

        function info(content) {
            addAlert('info', content);
        }

        function addAlert(type, content) {
            alertBox.type = type;
            alertBox.message = content;
        }
    }

})();